<!-- src/lib/components/Widget.svelte -->
<script>
  import { updateWidget, deleteWidget, duplicateWidget } from '$lib/stores/widgets';
  import { onMount, onDestroy } from 'svelte';
  
  export let widget;
  export let gridMode = false;
  
  let showMenu = false;
  let isEditing = false;
  let editContent = '';
  let editTitle = '';
  let editColor = '';
  
  $: if (isEditing) {
    editContent = widget.content;
    editTitle = widget.title;
    editColor = widget.color || 'blue';
  }
  
  const colorOptions = [
    { name: 'Blau', value: 'blue', color: '#3b82f6' },
    { name: 'Grün', value: 'green', color: '#10b981' },
    { name: 'Lila', value: 'purple', color: '#8b5cf6' },
    { name: 'Orange', value: 'orange', color: '#f59e0b' },
    { name: 'Rot', value: 'red', color: '#ef4444' },
    { name: 'Grau', value: 'gray', color: '#6b7280' }
  ];
  
  function toggleMenu(event) {
    event.stopPropagation();
    showMenu = !showMenu;
  }
  
  function startEdit() {
    isEditing = true;
    showMenu = false;
  }
  
  function saveEdit() {
    updateWidget(widget.id, {
      title: editTitle,
      content: editContent,
      color: editColor
    });
    isEditing = false;
  }
  
  function cancelEdit() {
    isEditing = false;
    editContent = widget.content;
    editTitle = widget.title;
    editColor = widget.color || 'blue';
  }
  
  function handleDelete() {
    if (confirm(`Widget "${widget.title}" wirklich löschen?`)) {
      deleteWidget(widget.id);
    }
    showMenu = false;
  }
  
  function handleDuplicate() {
    duplicateWidget(widget.id);
    showMenu = false;
  }
  
  function renderMarkdown(content) {
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="checkbox"><input type="checkbox" disabled> <span>$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="checkbox checked"><input type="checkbox" checked disabled> <span>$1</span></div>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^---$/gim, '<hr>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }
  
  function handleClickOutside(event) {
    if (!event.target.closest('.widget-menu-container')) {
      showMenu = false;
    }
  }
  
  function getColorClass(color) {
    return `widget-${color || 'blue'}`;
  }
  
  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div
  class="widget {getColorClass(widget.color)}"
  class:editing={isEditing}
  class:grid-mode={gridMode}
>
  <div class="widget-header">
    <div class="widget-title-section">
      <div class="widget-color-indicator"></div>
      <div class="widget-title">
        {#if isEditing}
          <input 
            bind:value={editTitle}
            class="title-input"
            placeholder="Widget Titel..."
          />
        {:else}
          {widget.title}
        {/if}
      </div>
    </div>
    
    <div class="widget-controls">
      <div class="widget-menu-container">
        <button 
          class="widget-control-btn" 
          on:click={toggleMenu}
          title="Widget-Menü"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
        
        {#if showMenu}
          <div class="widget-menu">
            <button on:click={startEdit} class="menu-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Bearbeiten
            </button>
            <button on:click={handleDuplicate} class="menu-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
              Duplizieren
            </button>
            <div class="menu-divider"></div>
            <button on:click={handleDelete} class="menu-item danger">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              </svg>
              Löschen
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="widget-content">
    {#if isEditing}
      <div class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label>Typ</label>
            <select bind:value={widget.type} class="form-select">
              <option value="html">HTML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Farbe</label>
            <div class="color-picker">
              {#each colorOptions as color}
                <button
                  class="color-option"
                  class:active={editColor === color.value}
                  style="background-color: {color.color}"
                  on:click={() => editColor = color.value}
                  title={color.name}
                >
                  {#if editColor === color.value}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Inhalt</label>
          <textarea 
            bind:value={editContent}
            placeholder={widget.type === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
            class="content-editor"
          ></textarea>
        </div>
        
        <div class="edit-actions">
          <button class="btn btn-secondary" on:click={cancelEdit}>
            Abbrechen
          </button>
          <button class="btn btn-primary" on:click={saveEdit}>
            Speichern
          </button>
        </div>
      </div>
    {:else}
      <div class="widget-body">
        {#if widget.type === 'html'}
          {@html widget.content}
        {:else if widget.type === 'markdown'}
          <div class="markdown-content">
            {@html renderMarkdown(widget.content)}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .widget {
    height: 100%;
    background: var(--bg-primary);
    border-radius: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .widget.grid-mode {
    border-radius: 16px;
  }
  
  .widget.editing {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  /* Widget Color Variants */
  .widget-blue { border-left: 4px solid #3b82f6; }
  .widget-green { border-left: 4px solid #10b981; }
  .widget-purple { border-left: 4px solid #8b5cf6; }
  .widget-orange { border-left: 4px solid #f59e0b; }
  .widget-red { border-left: 4px solid #ef4444; }
  .widget-gray { border-left: 4px solid #6b7280; }
  
  .widget-blue .widget-color-indicator { background: #3b82f6; }
  .widget-green .widget-color-indicator { background: #10b981; }
  .widget-purple .widget-color-indicator { background: #8b5cf6; }
  .widget-orange .widget-color-indicator { background: #f59e0b; }
  .widget-red .widget-color-indicator { background: #ef4444; }
  .widget-gray .widget-color-indicator { background: #6b7280; }
  
  .widget-header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    flex-shrink: 0;
  }
  
  .widget-title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .widget-color-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .widget-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9375rem;
    flex: 1;
    line-height: 1.4;
  }
  
  .title-input {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    width: 100%;
    outline: none;
    transition: all 150ms ease;
  }
  
  .title-input:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .widget-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .widget-menu-container {
    position: relative;
  }
  
  .widget-control-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }
  
  .widget-control-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--accent-color);
  }
  
  .widget-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    z-index: 1001;
    min-width: 160px;
    overflow: hidden;
    backdrop-filter: blur(8px);
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .menu-item:hover {
    background: var(--bg-hover);
  }
  
  .menu-item.danger {
    color: #ef4444;
  }
  
  .menu-item.danger:hover {
    background: #fef2f2;
    color: #dc2626;
  }
  
  .menu-divider {
    height: 1px;
    background: var(--border);
    margin: 0.5rem 0;
  }
  
  .widget-content {
    height: calc(100% - 60px);
    overflow: hidden;
    flex: 1;
  }
  
  .widget-body {
    height: 100%;
    overflow-y: auto;
    padding: 1.25rem;
    color: var(--text-primary);
    line-height: 1.6;
  }
  
  .edit-form {
    height: 100%;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .form-select {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    outline: none;
    transition: all 150ms ease;
  }
  
  .form-select:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .color-picker {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .color-option {
    width: 28px;
    height: 28px;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover {
    transform: scale(1.1);
  }
  
  .color-option.active {
    border-color: var(--bg-primary);
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--accent-color);
  }
  
  .content-editor {
    flex: 1;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    resize: none;
    outline: none;
    transition: all 150ms ease;
    line-height: 1.5;
  }
  
  .content-editor:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .edit-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .btn-primary {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .btn-primary:hover {
    background: var(--accent-hover);
  }
  
  /* Markdown Content Styling */
  .markdown-content {
    font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  :global(.widget-body h1) {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }
  
  :global(.widget-body h2) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 1.5rem 0 0.75rem 0;
    line-height: 1.3;
  }
  
  :global(.widget-body h3) {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 1.25rem 0 0.5rem 0;
    line-height: 1.4;
  }
  
  :global(.widget-body p) {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    line-height: 1.6;
  }
  
  :global(.widget-body strong) {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  :global(.widget-body em) {
    font-style: italic;
    color: var(--text-secondary);
  }
  
  :global(.widget-body del) {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  
  :global(.widget-body a) {
    color: var(--accent-color);
    text-decoration: none;
    font-weight: 500;
  }
  
  :global(.widget-body a:hover) {
    text-decoration: underline;
  }
  
  :global(.widget-body blockquote) {
    border-left: 4px solid var(--accent-color);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--text-secondary);
    font-style: italic;
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 8px;
  }
  
  :global(.widget-body code) {
    background: var(--bg-secondary);
    color: var(--accent-color);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.875em;
  }
  
  :global(.widget-body hr) {
    border: none;
    height: 1px;
    background: var(--border);
    margin: 1.5rem 0;
  }
  
  :global(.widget-body li) {
    margin: 0.5rem 0;
    color: var(--text-primary);
    line-height: 1.5;
  }
  
  :global(.widget-body ul) {
    padding-left: 1.5rem;
    margin: 1rem 0;
  }
  
  :global(.widget-body .checkbox) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 150ms ease;
  }
  
  :global(.widget-body .checkbox:hover) {
    background: var(--bg-secondary);
  }
  
  :global(.widget-body .checkbox.checked) {
    background: var(--bg-secondary);
  }
  
  :global(.widget-body .checkbox.checked span) {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  
  :global(.widget-body .checkbox input) {
    margin: 0;
    accent-color: var(--accent-color);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .widget-header {
      padding: 0.75rem 1rem;
    }
    
    .widget-content {
      height: calc(100% - 56px);
    }
    
    .widget-body {
      padding: 1rem;
    }
    
    .edit-form {
      padding: 1rem;
    }
  }
</style>