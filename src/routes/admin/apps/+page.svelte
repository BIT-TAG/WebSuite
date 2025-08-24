<script lang="ts">
  import { onMount } from 'svelte';
  import type { App, Widget } from '$lib/types/app';
  
  let apps: App[] = [];
  let loading = true;
  let error = '';
  
  // Modal states
  let showAppModal = false;
  let showWidgetModal = false;
  let editingApp: App | null = null;
  let editingWidget: Widget | null = null;
  let selectedAppId = '';
  
  // Form data
  let appForm = {
    name: '',
    icon: '🔧',
    url: '',
    color: '#3b82f6',
    descriptionShort: '',
    info: {
      format: 'markdown' as const,
      content: ''
    }
  };
  
  let widgetForm = {
    title: '',
    widgetType: 'markdown' as const,
    content: '',
    color: 'blue',
    visible: true,
    props: '{}'
  };
  
  const iconOptions = ['🔧', '📱', '💻', '🌐', '📊', '📝', '📚', '🎵', '🎮', '📷', '🗂️', '⚙️'];
  const colorOptions = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];
  
  onMount(async () => {
    await loadApps();
  });
  
  async function loadApps() {
    try {
      loading = true;
      const response = await fetch('/api/apps');
      if (!response.ok) throw new Error('Failed to load apps');
      apps = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }
  
  function openAppModal(app?: App) {
    editingApp = app || null;
    if (app) {
      appForm = {
        name: app.name,
        icon: app.icon,
        url: app.url,
        color: app.color,
        descriptionShort: app.descriptionShort,
        info: app.info || { format: 'markdown', content: '' }
      };
    } else {
      appForm = {
        name: '',
        icon: '🔧',
        url: '',
        color: '#3b82f6',
        descriptionShort: '',
        info: { format: 'markdown', content: '' }
      };
    }
    showAppModal = true;
  }
  
  function openWidgetModal(appId: string, widget?: Widget) {
    selectedAppId = appId;
    editingWidget = widget || null;
    if (widget) {
      widgetForm = {
        title: widget.title,
        widgetType: widget.widgetType,
        content: widget.content,
        color: widget.color,
        visible: widget.visible,
        props: JSON.stringify(widget.props, null, 2)
      };
    } else {
      widgetForm = {
        title: '',
        widgetType: 'markdown',
        content: '',
        color: 'blue',
        visible: true,
        props: '{}'
      };
    }
    showWidgetModal = true;
  }
  
  async function saveApp() {
    try {
      const data = {
        ...appForm,
        info: appForm.info.content ? appForm.info : undefined
      };
      
      let response;
      if (editingApp) {
        response = await fetch(`/api/apps/${editingApp.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch('/api/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      
      if (!response.ok) throw new Error('Failed to save app');
      
      showAppModal = false;
      await loadApps();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save app');
    }
  }
  
  async function saveWidget() {
    try {
      let props;
      try {
        props = JSON.parse(widgetForm.props);
      } catch {
        props = {};
      }
      
      const data = {
        title: widgetForm.title,
        widgetType: widgetForm.widgetType,
        content: widgetForm.content,
        color: widgetForm.color,
        visible: widgetForm.visible,
        props
      };
      
      let response;
      if (editingWidget) {
        response = await fetch(`/api/apps/${selectedAppId}/widgets/${editingWidget.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(`/api/apps/${selectedAppId}/widgets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      
      if (!response.ok) throw new Error('Failed to save widget');
      
      showWidgetModal = false;
      await loadApps();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save widget');
    }
  }
  
  async function deleteApp(id: string) {
    if (!confirm('Are you sure you want to delete this app?')) return;
    
    try {
      const response = await fetch(`/api/apps/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete app');
      await loadApps();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete app');
    }
  }
  
  async function deleteWidget(appId: string, widgetId: string) {
    if (!confirm('Are you sure you want to delete this widget?')) return;
    
    try {
      const response = await fetch(`/api/apps/${appId}/widgets/${widgetId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete widget');
      await loadApps();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete widget');
    }
  }
</script>

<svelte:head>
  <title>Apps Management - WebSuite Admin</title>
</svelte:head>

<div class="apps-admin">
  <div class="page-header">
    <h1>Apps Management</h1>
    <button class="btn btn-primary" on:click={() => openAppModal()}>
      ➕ Add App
    </button>
  </div>
  
  {#if loading}
    <div class="loading">Loading apps...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    <div class="apps-grid">
      {#each apps as app (app.id)}
        <div class="app-card">
          <div class="app-header">
            <div class="app-icon" style="background: {app.color}">
              {app.icon}
            </div>
            <div class="app-info">
              <h3>{app.name}</h3>
              <p>{app.descriptionShort}</p>
              <small>{app.widgets.length} widgets</small>
            </div>
            <div class="app-actions">
              <button class="btn btn-sm" on:click={() => openAppModal(app)}>
                ✏️ Edit
              </button>
              <button class="btn btn-sm btn-danger" on:click={() => deleteApp(app.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
          
          <div class="widgets-section">
            <div class="widgets-header">
              <h4>Widgets</h4>
              <button class="btn btn-sm" on:click={() => openWidgetModal(app.id)}>
                ➕ Add Widget
              </button>
            </div>
            
            {#if app.widgets.length > 0}
              <div class="widgets-list">
                {#each app.widgets as widget (widget.id)}
                  <div class="widget-item">
                    <div class="widget-info">
                      <strong>{widget.title}</strong>
                      <span class="widget-type">{widget.widgetType}</span>
                      <span class="widget-size">{widget.dim.w}×{widget.dim.h}</span>
                    </div>
                    <div class="widget-actions">
                      <button class="btn btn-xs" on:click={() => openWidgetModal(app.id, widget)}>
                        ✏️
                      </button>
                      <button class="btn btn-xs btn-danger" on:click={() => deleteWidget(app.id, widget.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <p class="no-widgets">No widgets yet</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- App Modal -->
{#if showAppModal}
  <div class="modal-overlay" on:click={() => showAppModal = false}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{editingApp ? 'Edit App' : 'Add App'}</h2>
        <button class="close-btn" on:click={() => showAppModal = false}>✖</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Name</label>
          <input type="text" bind:value={appForm.name} placeholder="App name" />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Icon</label>
            <div class="icon-picker">
              {#each iconOptions as icon}
                <button 
                  class="icon-option"
                  class:active={appForm.icon === icon}
                  on:click={() => appForm.icon = icon}
                >
                  {icon}
                </button>
              {/each}
            </div>
          </div>
          
          <div class="form-group">
            <label>Color</label>
            <div class="color-picker">
              {#each colorOptions as color}
                <button 
                  class="color-option"
                  class:active={appForm.color === color}
                  style="background: {color}"
                  on:click={() => appForm.color = color}
                ></button>
              {/each}
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>URL</label>
          <input type="url" bind:value={appForm.url} placeholder="https://example.com" />
        </div>
        
        <div class="form-group">
          <label>Short Description</label>
          <input type="text" bind:value={appForm.descriptionShort} placeholder="Brief description" />
        </div>
        
        <div class="form-group">
          <label>Info Format</label>
          <select bind:value={appForm.info.format}>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Info Content</label>
          <textarea 
            bind:value={appForm.info.content} 
            placeholder="Detailed information about the app"
            rows="6"
          ></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" on:click={() => showAppModal = false}>Cancel</button>
        <button class="btn btn-primary" on:click={saveApp}>Save</button>
      </div>
    </div>
  </div>
{/if}

<!-- Widget Modal -->
{#if showWidgetModal}
  <div class="modal-overlay" on:click={() => showWidgetModal = false}>
    <div class="modal" on:click|stopPropagation>
      <div class="modal-header">
        <h2>{editingWidget ? 'Edit Widget' : 'Add Widget'}</h2>
        <button class="close-btn" on:click={() => showWidgetModal = false}>✖</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label>Title</label>
          <input type="text" bind:value={widgetForm.title} placeholder="Widget title" />
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Type</label>
            <select bind:value={widgetForm.widgetType}>
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Color</label>
            <select bind:value={widgetForm.color}>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="red">Red</option>
              <option value="gray">Gray</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" bind:checked={widgetForm.visible} />
            Visible
          </label>
        </div>
        
        <div class="form-group">
          <label>Content</label>
          <textarea 
            bind:value={widgetForm.content} 
            placeholder="Widget content"
            rows="6"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label>Props (JSON)</label>
          <textarea 
            bind:value={widgetForm.props} 
            placeholder="{}"
            rows="3"
          ></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn" on:click={() => showWidgetModal = false}>Cancel</button>
        <button class="btn btn-primary" on:click={saveWidget}>Save</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .apps-admin {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .apps-grid {
    display: grid;
    gap: 2rem;
  }
  
  .app-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .app-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .app-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
  }
  
  .app-info {
    flex: 1;
  }
  
  .app-info h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .app-info p {
    margin: 0 0 0.25rem 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .app-info small {
    color: #9ca3af;
    font-size: 0.75rem;
  }
  
  .app-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .widgets-section {
    padding: 1.5rem;
  }
  
  .widgets-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .widgets-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .widgets-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .widget-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
  }
  
  .widget-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .widget-type, .widget-size {
    font-size: 0.75rem;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
  }
  
  .widget-actions {
    display: flex;
    gap: 0.25rem;
  }
  
  .no-widgets {
    color: #9ca3af;
    font-style: italic;
    text-align: center;
    padding: 2rem;
  }
  
  .loading, .error {
    text-align: center;
    padding: 2rem;
    color: #6b7280;
  }
  
  .error {
    color: #dc2626;
  }
  
  /* Button Styles */
  .btn {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: white;
    color: #374151;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn:hover {
    background: #f9fafb;
  }
  
  .btn-primary {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .btn-primary:hover {
    background: #2563eb;
  }
  
  .btn-danger {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  .btn-danger:hover {
    background: #dc2626;
  }
  
  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .btn-xs {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background: white;
    border-radius: 0.5rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
  }
  
  .close-btn:hover {
    color: #374151;
  }
  
  .modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
  
  /* Form Styles */
  .form-group {
    margin-bottom: 1rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .icon-picker {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .icon-option {
    width: 40px;
    height: 40px;
    border: 2px solid #e5e7eb;
    border-radius: 0.375rem;
    background: white;
    cursor: pointer;
    font-size: 1.25rem;
    transition: all 0.2s;
  }
  
  .icon-option:hover {
    border-color: #3b82f6;
  }
  
  .icon-option.active {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .color-picker {
    display: flex;
    gap: 0.5rem;
  }
  
  .color-option {
    width: 32px;
    height: 32px;
    border: 2px solid #e5e7eb;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .color-option:hover {
    transform: scale(1.1);
  }
  
  .color-option.active {
    border-color: #1f2937;
    transform: scale(1.1);
  }
</style>