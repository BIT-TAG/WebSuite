<!-- src/lib/components/Dashboard.svelte -->
<script>
  import { windows, openWindow } from '$lib/stores/windows';
  import { widgets, addWidget } from '$lib/stores/widgets';
  import Widget from './Widget.svelte';
  import { switchToDesktop } from '$lib/stores/view';
  import { onMount } from 'svelte';

  const dashboardApps = [
    { name: 'Wikipedia', icon: '📚', url: 'https://de.wikipedia.org' },
    { name: 'Calculator', icon: '🧮', url: 'https://www.calculator.net' },
    { name: 'Notes', icon: '📝', url: 'https://keep.google.com' },
    { name: 'Weather', icon: '🌤️', url: 'https://weather.com' },
    { name: 'Calendar', icon: '📅', url: 'https://calendar.google.com' },
    { name: 'Music', icon: '🎵', url: 'https://open.spotify.com' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com' },
    { name: 'GitHub', icon: '💻', url: 'https://github.com' },
    { name: 'Maps', icon: '🗺️', url: 'https://maps.google.com' }
  ];

  let showAddWidget = false;
  let newWidgetTitle = '';
  let newWidgetType = 'markdown';
  let newWidgetContent = '';

  let openMenuId = null;

  function launchApp(app) {
    // Fenster öffnen
    openWindow({
      title: app.name,
      iframeSrc: app.url
    });
    
    // Automatisch zum Desktop wechseln
    switchToDesktop();
  }

  function addNewWidget() {
    if (newWidgetTitle.trim() && newWidgetContent.trim()) {
      addWidget({
        title: newWidgetTitle.trim(),
        type: newWidgetType,
        content: newWidgetContent.trim(),
        position: { x: 50 + $widgets.length * 20, y: 50 + $widgets.length * 20 },
        size: { width: 300, height: 200 },
        visible: true
      });
      
      // Reset form
      newWidgetTitle = '';
      newWidgetContent = '';
      newWidgetType = 'markdown';
      showAddWidget = false;
    }
  }

  function toggleMenu(appName, event) {
    event.stopPropagation();
    openMenuId = openMenuId === appName ? null : appName;
  }

  function closeMenu() {
    openMenuId = null;
  }

  function handleAppAction(app, action, event) {
    event.stopPropagation();
    closeMenu();
    
    switch(action) {
      case 'window':
        launchApp(app);
        break;
      case 'tab':
        window.open(app.url, '_blank');
        break;
      case 'info':
        openWindow({
          title: `Info: ${app.name}`,
          content: `App: ${app.name}\nURL: ${app.url}\nIcon: ${app.icon}`
        });
        switchToDesktop();
        break;
    }
  }

  onMount(() => {
    function handleClickOutside(event) {
      if (!event.target.closest('.app-menu-container')) {
        closeMenu();
      }
    }
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class="dashboard">
  <!-- Widgets -->
  {#each $widgets.filter(w => w.visible) as widget (widget.id)}
    <Widget {widget} />
  {/each}
  
  <div class="dashboard-header">
    <div class="header-content">
      <div class="header-text">
        <h2>Dashboard</h2>
        <p>Widgets und Apps verwalten</p>
      </div>
      <button class="add-widget-btn" on:click={() => showAddWidget = true}>
        ➕ Widget hinzufügen
      </button>
    </div>
  </div>
  
  <div class="app-grid">
    {#each dashboardApps as app}
      <div class="app-card" on:click={() => launchApp(app)} role="button" tabindex="0" on:keydown>
        <div class="app-icon">{app.icon}</div>
        <div class="app-name">
          {app.name}
          <div class="app-menu-container">
            <button 
              class="app-menu" 
              on:click={(e) => toggleMenu(app.name, e)}
              aria-label="App-Menü öffnen"
            >
              ⋮
            </button>
            {#if openMenuId === app.name}
              <div class="context-menu">
                <button on:click={(e) => handleAppAction(app, 'window', e)}>
                  🖥️ Im Fenster öffnen
                </button>
                <button on:click={(e) => handleAppAction(app, 'tab', e)}>
                  🔗 In neuem Tab öffnen
                </button>
                <button on:click={(e) => handleAppAction(app, 'info', e)}>
                  ℹ️ App-Info
                </button>
              </div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Add Widget Modal -->
  {#if showAddWidget}
    <div class="modal-overlay" on:click={() => showAddWidget = false}>
      <div class="add-widget-modal" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Neues Widget erstellen</h3>
          <button class="close-btn" on:click={() => showAddWidget = false}>✖</button>
        </div>
        
        <div class="modal-content">
          <div class="form-group">
            <label for="widget-title">Titel</label>
            <input 
              id="widget-title"
              type="text" 
              bind:value={newWidgetTitle}
              placeholder="Widget Titel..."
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="widget-type">Typ</label>
            <select id="widget-type" bind:value={newWidgetType} class="form-select">
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="widget-content">Inhalt</label>
            <textarea 
              id="widget-content"
              bind:value={newWidgetContent}
              placeholder={newWidgetType === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="cancel-btn" on:click={() => showAddWidget = false}>
            Abbrechen
          </button>
          <button 
            class="create-btn" 
            on:click={addNewWidget}
            disabled={!newWidgetTitle.trim() || !newWidgetContent.trim()}
          >
            Widget erstellen
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    height: 100%;
    position: relative;
    background: var(--bg-secondary);
    overflow-y: auto;
  }

  .dashboard-header {
    position: sticky;
    top: 0;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 2rem;
    z-index: 100;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .header-text {
    text-align: center;
    flex: 1;
  }

  .header-text h2 {
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    font-size: 2.25rem;
    font-weight: 300;
    letter-spacing: -0.025em;
  }

  .header-text p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1.125rem;
    font-weight: 400;
  }

  .add-widget-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  }
  
  .add-widget-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
  }
  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.25rem;
    max-width: 900px;
    margin: 2rem auto;
    padding: 0 2rem;
  }

  .app-card {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 150ms ease;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    position: relative;
  }

  .app-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-color: var(--accent-color);
  }

  .app-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .app-name {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.8125rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .app-menu-container {
    position: relative;
  }

  .app-menu {
    background: var(--bg-secondary);
    border: none;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.625rem;
    color: var(--text-muted);
    transition: all 150ms ease;
  }

  .app-menu:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .context-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    z-index: 1000;
    min-width: 180px;
    overflow: hidden;
  }

  .context-menu button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: var(--bg-primary);
    text-align: left;
    cursor: pointer;
    font-size: 0.8125rem;
    color: var(--text-primary);
    transition: all 150ms ease;
    font-weight: 500;
  }

  .context-menu button:hover {
    background: var(--bg-hover);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .add-widget-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
  }
  
  .modal-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 1rem;
    transition: all 150ms ease;
  }
  
  .close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .modal-content {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 150ms ease;
    font-family: inherit;
  }
  
  .form-textarea {
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 120px;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .modal-actions {
    padding: 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    background: var(--bg-secondary);
  }
  
  .cancel-btn,
  .create-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    border: none;
  }
  
  .cancel-btn {
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  
  .cancel-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .create-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .create-btn:hover:not(:disabled) {
    background: var(--accent-hover);
  }
  
  .create-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>