<!-- src/lib/components/ContextMenu.svelte -->
<script>
  import { contextMenu, updateWidget, apps } from '$lib/stores/widgets';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  
  let showEditModal = false;
  let editingItem = null;
  
  // Edit form data
  let editTitle = '';
  let editContent = '';
  let editType = 'markdown';
  let editColor = 'blue';
  let editWidth = 2;
  let editHeight = 2;
  let editName = '';
  let editUrl = '';
  let editIcon = '🔧';
  let editAppColor = '#3b82f6';
  
  const colorOptions = [
    { name: 'Blau', value: 'blue', color: '#3b82f6' },
    { name: 'Grün', value: 'green', color: '#10b981' },
    { name: 'Lila', value: 'purple', color: '#8b5cf6' },
    { name: 'Orange', value: 'orange', color: '#f59e0b' },
    { name: 'Rot', value: 'red', color: '#ef4444' },
    { name: 'Grau', value: 'gray', color: '#6b7280' }
  ];
  
  const appIcons = ['🔧', '📱', '💻', '🌐', '📊', '📝', '📚', '🎵', '🎮', '📷', '🗂️', '⚙️'];
  const appColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];
  
  function closeMenu() {
    contextMenu.set({ open: false, x: 0, y: 0, item: null });
  }
  
  function handleEdit() {
    if (!$contextMenu.item) return;
    
    editingItem = $contextMenu.item;
    
    if (editingItem.kind === 'widget') {
      editTitle = editingItem.title;
      editContent = editingItem.content;
      editType = editingItem.widgetType || 'markdown';
      editColor = editingItem.color || 'blue';
      editWidth = editingItem.dim.w;
      editHeight = editingItem.dim.h;
    } else if (editingItem.kind === 'app') {
      editName = editingItem.name;
      editUrl = editingItem.url;
      editIcon = editingItem.icon;
      editAppColor = editingItem.color;
    }
    
    showEditModal = true;
    closeMenu();
  }
  
  function saveEdit() {
    if (!editingItem) return;
    
    if (editingItem.kind === 'widget') {
      updateWidget(editingItem.id, {
        title: editTitle,
        content: editContent,
        widgetType: editType,
        color: editColor,
        dim: { w: editWidth, h: editHeight }
      });
    } else if (editingItem.kind === 'app') {
      apps.update(a => 
        a.map(app => 
          app.id === editingItem.id 
            ? { ...app, name: editName, url: editUrl, icon: editIcon, color: editAppColor }
            : app
        )
      );
    }
    
    closeEditModal();
  }
  
  function closeEditModal() {
    showEditModal = false;
    editingItem = null;
  }
  
  function handleClickOutside(event) {
    if (!event.target.closest('.context-menu') && !event.target.closest('.edit-modal')) {
      closeMenu();
    }
    if (!event.target.closest('.info-modal') && !event.target.closest('.widget-menu-container')) {
      showInfoModal = false;
    }
  }
  
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      closeMenu();
      closeEditModal();
    }
  }
  
  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
  });
  
  onDestroy(() => {
    if (browser) {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  });
</script>

{#if $contextMenu.open}
  <div 
    class="context-menu"
    style="left: {$contextMenu.x}px; top: {$contextMenu.y}px;"
    role="menu"
    aria-label="Kontextmenü"
  >
    <button 
      class="menu-item"
      role="menuitem"
      tabindex="0"
      on:click={handleEdit}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Bearbeiten
    </button>
  </div>
{/if}

{#if showEditModal}
  <div class="modal-overlay" on:click={closeEditModal}>
    <div class="edit-modal" on:click|stopPropagation>
      <div class="modal-header">
        <h3 class="modal-title">
          {editingItem?.kind === 'app' ? 'App bearbeiten' : 'Widget bearbeiten'}
        </h3>
        <button class="close-btn" on:click={closeEditModal}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-content">
        {#if editingItem?.kind === 'app'}
          <!-- App Edit Form -->
          <div class="form-group">
            <label for="edit-app-name">App Name</label>
            <input 
              id="edit-app-name"
              type="text" 
              bind:value={editName}
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="edit-app-url">App URL</label>
            <input 
              id="edit-app-url"
              type="url" 
              bind:value={editUrl}
              class="form-input"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>App Icon</label>
              <div class="icon-picker">
                {#each appIcons as icon}
                  <button
                    class="icon-option"
                    class:active={editIcon === icon}
                    on:click={() => editIcon = icon}
                  >
                    {icon}
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="form-group">
              <label>App Farbe</label>
              <div class="color-picker">
                {#each appColors as color}
                  <button
                    class="color-option"
                    class:active={editAppColor === color}
                    style="background-color: {color}"
                    on:click={() => editAppColor = color}
                  >
                    {#if editAppColor === color}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {:else if editingItem?.kind === 'widget'}
          <!-- Widget Edit Form -->
          <div class="form-row">
            <div class="form-group">
              <label for="edit-widget-title">Widget Name</label>
              <input 
                id="edit-widget-title"
                type="text" 
                bind:value={editTitle}
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="edit-widget-type">Widget Typ</label>
              <select id="edit-widget-type" bind:value={editType} class="form-select">
                <option value="markdown">Markdown</option>
                <option value="html">HTML</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Widget Farbe</label>
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
          
          <div class="form-row">
            <div class="form-group">
              <label for="edit-widget-width">Breite (1-6)</label>
              <input 
                id="edit-widget-width"
                type="number" 
                bind:value={editWidth}
                min="1" 
                max="6"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="edit-widget-height">Höhe (1-6)</label>
              <input 
                id="edit-widget-height"
                type="number" 
                bind:value={editHeight}
                min="1" 
                max="6"
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="edit-widget-content">Widget Inhalt</label>
            <textarea 
              id="edit-widget-content"
              bind:value={editContent}
              placeholder={editType === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>
        {/if}
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" on:click={closeEditModal}>
          Abbrechen
        </button>
        <button class="btn btn-primary" on:click={saveEdit}>
          Speichern
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .context-menu {
    position: fixed;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 2000;
    min-width: 160px;
    overflow: hidden;
    animation: slideIn 150ms ease;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    color: #f0f6fc;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .menu-item:hover {
    background: #21262d;
    color: #58a6ff;
  }
  
  .menu-item:focus {
    outline: none;
    background: #21262d;
    color: #58a6ff;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 200ms ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .edit-modal {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    animation: slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }

  .modal-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #30363d;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #21262d;
  }

  .modal-title {
    margin: 0;
    color: #f0f6fc;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: #30363d;
    border: 1px solid #3b82f6;
    color: #3b82f6;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
  
  .close-btn:hover {
    background: #3b82f6;
    color: white;
  }
  
  .modal-content {
    padding: 2rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    color: #f0f6fc;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.75rem;
    border: 1px solid #30363d;
    border-radius: 6px;
    background: #0d1117;
    color: #f0f6fc;
    font-size: 0.875rem;
    transition: all 200ms ease;
    font-family: inherit;
    outline: none;
  }
  
  .form-textarea {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    resize: vertical;
    line-height: 1.5;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .color-picker {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .color-option {
    width: 36px;
    height: 36px;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .color-option.active {
    border-color: #f0f6fc;
    transform: scale(1.1);
    box-shadow: 0 0 0 2px #3b82f6;
  }
  
  .icon-picker {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .icon-option {
    width: 36px;
    height: 36px;
    border: 2px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #21262d;
    font-size: 1.25rem;
  }
  
  .icon-option:hover {
    transform: scale(1.1);
    background: #262c36;
  }
  
  .icon-option.active {
    border-color: #3b82f6;
    background: #262c36;
    transform: scale(1.1);
  }
  
  .modal-actions {
    padding: 1.5rem 2rem;
    border-top: 1px solid #30363d;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: #21262d;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms ease;
    border: none;
  }
  
  .btn-secondary {
    background: #30363d;
    color: #f0f6fc;
    border: 1px solid #3b82f6;
  }
  
  .btn-secondary:hover {
    background: #262c36;
    border-color: #58a6ff;
  }
  
  .btn-primary {
    background: #238636;
    color: white;
  }
  
  .btn-primary:hover {
    background: #2ea043;
    transform: translateY(-1px);
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .edit-modal {
      width: 95%;
      max-height: 95vh;
    }
    
    .modal-content {
      padding: 1.5rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>