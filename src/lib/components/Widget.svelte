<!-- src/lib/components/Widget.svelte -->
<script>
  import { updateWidget, deleteWidget } from '$lib/stores/widgets';
  import { onMount, onDestroy } from 'svelte';
  
  export let widget;
  
  let widgetElement;
  let isDragging = false;
  let isResizing = false;
  let dragOffset = { x: 0, y: 0 };
  let resizeStart = { x: 0, y: 0, width: 0, height: 0 };
  let showMenu = false;
  let isEditing = false;
  let editContent = '';
  let editTitle = '';
  
  $: if (isEditing) {
    editContent = widget.content;
    editTitle = widget.title;
  }
  
  function handleMouseDown(event) {
    if (event.target.closest('.widget-resize') || event.target.closest('.widget-menu')) return;
    
    isDragging = true;
    const rect = widgetElement.getBoundingClientRect();
    dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    event.preventDefault();
  }
  
  function handleMouseMove(event) {
    if (isDragging) {
      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;
      
      updateWidget(widget.id, {
        position: { x: Math.max(0, newX), y: Math.max(0, newY) }
      });
    } else if (isResizing) {
      const deltaX = event.clientX - resizeStart.x;
      const deltaY = event.clientY - resizeStart.y;
      
      const newWidth = Math.max(200, resizeStart.width + deltaX);
      const newHeight = Math.max(150, resizeStart.height + deltaY);
      
      updateWidget(widget.id, {
        size: { width: newWidth, height: newHeight }
      });
    }
  }
  
  function handleMouseUp() {
    isDragging = false;
    isResizing = false;
  }
  
  function handleResizeStart(event) {
    isResizing = true;
    resizeStart = {
      x: event.clientX,
      y: event.clientY,
      width: widget.size.width,
      height: widget.size.height
    };
    event.preventDefault();
    event.stopPropagation();
  }
  
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
      content: editContent
    });
    isEditing = false;
  }
  
  function cancelEdit() {
    isEditing = false;
    editContent = widget.content;
    editTitle = widget.title;
  }
  
  function handleDelete() {
    if (confirm('Widget wirklich löschen?')) {
      deleteWidget(widget.id);
    }
    showMenu = false;
  }
  
  function renderMarkdown(content) {
    // Einfache Markdown-zu-HTML Konvertierung
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="checkbox"><input type="checkbox" disabled> $1</div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="checkbox"><input type="checkbox" checked disabled> $1</div>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br>');
  }
  
  function handleClickOutside(event) {
    if (!event.target.closest('.widget-menu-container')) {
      showMenu = false;
    }
  }
  
  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClickOutside);
  });
  
  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div
  bind:this={widgetElement}
  class="widget"
  class:dragging={isDragging}
  class:resizing={isResizing}
  style="
    left: {widget.position.x}px;
    top: {widget.position.y}px;
    width: {widget.size.width}px;
    height: {widget.size.height}px;
  "
>
  <div class="widget-header" on:mousedown={handleMouseDown}>
    <div class="widget-title">
      {#if isEditing}
        <input 
          bind:value={editTitle}
          class="title-input"
          on:click|stopPropagation
        />
      {:else}
        {widget.title}
      {/if}
    </div>
    
    <div class="widget-menu-container">
      <button 
        class="widget-menu-btn" 
        on:click={toggleMenu}
        on:mousedown|stopPropagation
      >
        ⋮
      </button>
      
      {#if showMenu}
        <div class="widget-menu">
          <button on:click={startEdit}>✏️ Bearbeiten</button>
          <button on:click={handleDelete}>🗑️ Löschen</button>
        </div>
      {/if}
    </div>
  </div>
  
  <div class="widget-content">
    {#if isEditing}
      <div class="edit-form">
        <div class="form-group">
          <label>Typ:</label>
          <select bind:value={widget.type}>
            <option value="html">HTML</option>
            <option value="markdown">Markdown</option>
          </select>
        </div>
        <textarea 
          bind:value={editContent}
          placeholder={widget.type === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
          class="content-editor"
        ></textarea>
        <div class="edit-actions">
          <button class="save-btn" on:click={saveEdit}>💾 Speichern</button>
          <button class="cancel-btn" on:click={cancelEdit}>❌ Abbrechen</button>
        </div>
      </div>
    {:else}
      <div class="widget-body">
        {#if widget.type === 'html'}
          {@html widget.content}
        {:else if widget.type === 'markdown'}
          {@html renderMarkdown(widget.content)}
        {/if}
      </div>
    {/if}
  </div>
  
  <div 
    class="widget-resize"
    on:mousedown={handleResizeStart}
  ></div>
</div>

<style>
  .widget {
    position: absolute;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    overflow: hidden;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 200px;
    min-height: 150px;
  }
  
  .widget:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .widget.dragging {
    transform: rotate(1deg) scale(1.02);
    z-index: 1000;
  }
  
  .widget.resizing {
    z-index: 1000;
  }
  
  .widget-header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1rem;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }
  
  .widget-title {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.875rem;
    flex: 1;
  }
  
  .title-input {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    width: 100%;
  }
  
  .widget-menu-container {
    position: relative;
  }
  
  .widget-menu-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 150ms ease;
  }
  
  .widget-menu-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .widget-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    z-index: 1001;
    min-width: 140px;
    overflow: hidden;
  }
  
  .widget-menu button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 150ms ease;
  }
  
  .widget-menu button:hover {
    background: var(--bg-hover);
  }
  
  .widget-content {
    height: calc(100% - 3rem);
    overflow: hidden;
  }
  
  .widget-body {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    color: var(--text-primary);
  }
  
  .edit-form {
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .form-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .form-group select {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
  }
  
  .content-editor {
    flex: 1;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: none;
    outline: none;
  }
  
  .content-editor:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .edit-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  .save-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .save-btn:hover {
    background: var(--accent-hover);
  }
  
  .cancel-btn {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  
  .cancel-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .widget-resize {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: se-resize;
    background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--border) 30%, var(--border) 40%, transparent 40%, transparent 60%, var(--border) 60%, var(--border) 70%, transparent 70%);
  }
  
  .widget-resize:hover {
    background: linear-gradient(-45deg, transparent 0%, transparent 30%, var(--accent-color) 30%, var(--accent-color) 40%, transparent 40%, transparent 60%, var(--accent-color) 60%, var(--accent-color) 70%, transparent 70%);
  }
  
  /* Markdown Styling */
  :global(.widget-body h1) {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
  }
  
  :global(.widget-body h2) {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
  }
  
  :global(.widget-body h3) {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }
  
  :global(.widget-body strong) {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  :global(.widget-body em) {
    font-style: italic;
    color: var(--text-secondary);
  }
  
  :global(.widget-body a) {
    color: var(--accent-color);
    text-decoration: none;
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
  }
  
  :global(.widget-body li) {
    margin: 0.25rem 0;
    color: var(--text-primary);
  }
  
  :global(.widget-body .checkbox) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
    color: var(--text-primary);
  }
  
  :global(.widget-body .checkbox input) {
    margin: 0;
  }
</style>