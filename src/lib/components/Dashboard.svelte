<script>
  import { widgets, addWidget, apps, addApp } from '$lib/stores/widgets';
  import { windows, openWindow } from '$lib/stores/windows';
  import { switchToDesktop } from '$lib/stores/view';
  import Widget from './Widget.svelte';

  let showAddModal = false;
  let addType = 'app'; // 'app' or 'widget'
  let showAddMenu = false;
  
  // App form data
  let newAppName = '';
  let newAppType = 'custom'; // 'custom' or 'libreworkspace'
  let newAppUrl = '';
  let newAppDomain = '';
  let newAppAddon = '';
  let newAppIcon = '🔧';
  let newAppColor = '#3b82f6';
  
  // Widget form data
  let newWidgetTitle = '';
  let newWidgetType = 'markdown';
  let newWidgetContent = '';
  let newWidgetColor = 'blue';

  const colorOptions = [
    { name: 'Blau', value: 'blue', color: '#3b82f6' },
    { name: 'Grün', value: 'green', color: '#10b981' },
    { name: 'Lila', value: 'purple', color: '#8b5cf6' },
    { name: 'Orange', value: 'orange', color: '#f59e0b' },
    { name: 'Rot', value: 'red', color: '#ef4444' },
    { name: 'Grau', value: 'gray', color: '#6b7280' }
  ];

  const widgetTemplates = [
    {
      name: 'Notizen',
      type: 'markdown',
      content: `## 📝 Meine Notizen

### Wichtige Aufgaben
- [ ] Aufgabe 1
- [ ] Aufgabe 2
- [x] Erledigte Aufgabe

### Ideen
- Neue Feature-Idee
- Verbesserungsvorschlag

---
*Letzte Aktualisierung: ${new Date().toLocaleDateString('de-DE')}*`
    },
    {
      name: 'Statistiken',
      type: 'html',
      content: `<div style="padding: 1.5rem; font-family: Inter, sans-serif;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
      <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);">42</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Wert 1</div>
    </div>
    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
      <div style="font-size: 2rem; font-weight: bold; color: #10b981;">28</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Wert 2</div>
    </div>
  </div>
</div>`
    },
    {
      name: 'Links',
      type: 'markdown',
      content: `## 🔗 Wichtige Links

### Arbeit
- [Projekt Dashboard](https://example.com)
- [Team Chat](https://example.com)
- [Dokumentation](https://example.com)

### Tools
- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)
- [MDN Docs](https://developer.mozilla.org)`
    }
  ];

  function launchApp(app) {
    openWindow({
      title: app.name,
      iframeSrc: app.type === 'libreworkspace' ? `${app.domain}/${app.addon}` : app.url
    });
    switchToDesktop();
  }

  function addNewApp() {
    if (newAppName.trim()) {
      const appData = {
        name: newAppName.trim(),
        type: newAppType,
        icon: newAppIcon,
        color: newAppColor
      };
      
      if (newAppType === 'custom') {
        appData.url = newAppUrl.trim();
      } else if (newAppType === 'libreworkspace') {
        appData.domain = newAppDomain.trim();
        appData.addon = newAppAddon.trim();
      }
      
      addApp(appData);
      resetAppForm();
      showAddModal = false;
    }
  }

  function addNewWidget() {
    if (newWidgetTitle.trim() && newWidgetContent.trim()) {
      addWidget({
        title: newWidgetTitle.trim(),
        type: newWidgetType,
        content: newWidgetContent.trim(),
        color: newWidgetColor
      });
      resetWidgetForm();
      showAddModal = false;
    }
  }

  function useWidgetTemplate(template) {
    newWidgetTitle = template.name;
    newWidgetType = template.type;
    newWidgetContent = template.content;
  }

  function resetAppForm() {
    newAppName = '';
    newAppType = 'custom';
    newAppUrl = '';
    newAppDomain = '';
    newAppAddon = '';
    newAppIcon = '🔧';
    newAppColor = '#3b82f6';
  }
  
  function resetWidgetForm() {
    newWidgetTitle = '';
    newWidgetContent = '';
    newWidgetType = 'markdown';
    newWidgetColor = 'blue';
  }

  function closeModal() {
    showAddModal = false;
    showAddMenu = false;
    resetAppForm();
    resetWidgetForm();
  }
  
  function toggleAddMenu() {
    showAddMenu = !showAddMenu;
  }
  
  function openAddModal(type) {
    addType = type;
    showAddModal = true;
    showAddMenu = false;
  }
  
  function handleClickOutside(event) {
    if (!event.target.closest('.add-menu-container')) {
      showAddMenu = false;
    }
  }

  $: visibleWidgets = $widgets.filter(w => w.visible);
  $: totalItems = visibleWidgets.length + $apps.length;
  
  const appIcons = ['🔧', '📱', '💻', '🌐', '📊', '📝', '📚', '🎵', '🎮', '📷', '🗂️', '⚙️'];
  const appColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6b7280'];
  
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
</script>

<div class="dashboard" on:click={handleClickOutside}>
  <div class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo-section">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
          </div>
          <div class="header-text">
            <h1>Dashboard</h1>
            <p>{totalItems} Apps verfügbar</p>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="add-menu-container">
          <button class="add-btn" on:click={toggleAddMenu} class:active={showAddMenu}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
          
          {#if showAddMenu}
            <div class="add-dropdown">
              <button class="dropdown-item" on:click={() => openAddModal('app')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M9 9h6v6H9z"/>
                </svg>
                App hinzufügen
              </button>
              <button class="dropdown-item" on:click={() => openAddModal('widget')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="7" height="9" x="3" y="3" rx="1"/>
                  <rect width="7" height="5" x="14" y="3" rx="1"/>
                  <rect width="7" height="9" x="14" y="12" rx="1"/>
                  <rect width="7" height="5" x="3" y="16" rx="1"/>
                </svg>
                Widget hinzufügen
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <div class="dashboard-content">
    {#if totalItems === 0}
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect width="7" height="9" x="3" y="3" rx="1"/>
            <rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/>
            <rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        </div>
        <h3>Keine Apps installiert</h3>
        <p>Fügen Sie Ihre erste App hinzu, um loszulegen.</p>
        <button class="install-btn" on:click={() => openAddModal('app')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Erste App installieren
        </button>
      </div>
    {:else}
      <div class="apps-grid">
        <!-- Apps -->
        {#each $apps as app}
          <div class="app-card" on:click={() => launchApp(app)}>
            <div class="app-icon" style="background: {app.color}">
              <span class="icon-emoji">{app.icon}</span>
            </div>
            <div class="app-info">
              <h3 class="app-name">{app.name}</h3>
              <p class="app-status">{app.status}</p>
            </div>
            <div class="app-actions">
              <button class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5,3 19,12 5,21"/>
                </svg>
              </button>
            </div>
          </div>
        {/each}
        
        <!-- Widgets als Apps -->
        {#each visibleWidgets as widget (widget.id)}
          <div class="app-card widget-app">
            <div class="widget-preview">
              <div class="widget-header">
                <div class="widget-color-indicator" style="background: {colorOptions.find(c => c.value === widget.color)?.color || '#3b82f6'}"></div>
                <h3 class="widget-title">{widget.title}</h3>
                <span class="widget-type-badge">{widget.type === 'markdown' ? 'MD' : 'HTML'}</span>
              </div>
              <div class="widget-content-preview">
                {#if widget.type === 'html'}
                  {@html widget.content}
                {:else if widget.type === 'markdown'}
                  <div class="markdown-preview">
                    {@html renderMarkdown(widget.content)}
                  </div>
                {/if}
              </div>
            </div>
              <span class="icon-emoji">
                {#if widget.type === 'markdown'}📝{:else}🔧{/if}
              </span>
            </div>
            <div class="app-info">
              <h3 class="app-name">{widget.title}</h3>
              <p class="app-status">Widget</p>
            </div>
            <div class="app-actions">
              <button class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          </div>
        {/each}
        
      </div>
    {/if}
  </div>

  {#if showAddModal}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="install-modal" on:click|stopPropagation>
        <div class="modal-header">
          <div class="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              {#if addType === 'app'}
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              {:else}
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              {/if}
            </svg>
            {addType === 'app' ? 'App installieren' : 'Widget erstellen'}
          </div>
          <button class="close-btn" on:click={closeModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          {#if addType === 'app'}
            <!-- App Form -->
            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label for="app-name">App Name</label>
                  <input 
                    id="app-name"
                    type="text" 
                    bind:value={newAppName}
                    placeholder="Meine App..."
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="app-type">App Typ</label>
                  <select id="app-type" bind:value={newAppType} class="form-select">
                    <option value="custom">Custom App</option>
                    <option value="libreworkspace">LibreWorkspace App</option>
                  </select>
                </div>
              </div>
              
              {#if newAppType === 'custom'}
                <div class="form-group">
                  <label for="app-url">App URL</label>
                  <input 
                    id="app-url"
                    type="url" 
                    bind:value={newAppUrl}
                    placeholder="https://example.com"
                    class="form-input"
                  />
                </div>
              {:else if newAppType === 'libreworkspace'}
                <div class="form-row">
                  <div class="form-group">
                    <label for="app-domain">Domain</label>
                    <input 
                      id="app-domain"
                      type="url" 
                      bind:value={newAppDomain}
                      placeholder="https://portal.bit-tag.com"
                      class="form-input"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="app-addon">Addon</label>
                    <input 
                      id="app-addon"
                      type="text" 
                      bind:value={newAppAddon}
                      placeholder="calendar"
                      class="form-input"
                    />
                  </div>
                </div>
              {/if}
              
              <div class="form-row">
                <div class="form-group">
                  <label>App Icon</label>
                  <div class="icon-picker">
                    {#each appIcons as icon}
                      <button
                        class="icon-option"
                        class:active={newAppIcon === icon}
                        on:click={() => newAppIcon = icon}
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
                        class:active={newAppColor === color}
                        style="background-color: {color}"
                        on:click={() => newAppColor = color}
                      >
                        {#if newAppColor === color}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        {/if}
                      </button>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <!-- Widget Form -->
            <div class="templates-section">
              <h4>Widget-Vorlagen</h4>
              <div class="templates-grid">
                {#each widgetTemplates as template}
                  <button 
                    class="template-card"
                    on:click={() => useWidgetTemplate(template)}
                  >
                    <div class="template-icon">
                      {#if template.type === 'markdown'}📝{:else}🔧{/if}
                    </div>
                    <div class="template-name">{template.name}</div>
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="form-section">
              <div class="form-row">
                <div class="form-group">
                  <label for="widget-name">Widget Name</label>
                  <input 
                    id="widget-name"
                    type="text" 
                    bind:value={newWidgetTitle}
                    placeholder="Mein Widget..."
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="widget-type">Widget Typ</label>
                  <select id="widget-type" bind:value={newWidgetType} class="form-select">
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
                      class:active={newWidgetColor === color.value}
                      style="background-color: {color.color}"
                      on:click={() => newWidgetColor = color.value}
                      title={color.name}
                    >
                      {#if newWidgetColor === color.value}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      {/if}
                    </button>
                  {/each}
                </div>
              </div>
              
              <div class="form-group">
                <label for="widget-content">Widget Inhalt</label>
                <textarea 
                  id="widget-content"
                  bind:value={newWidgetContent}
                  placeholder={newWidgetType === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
                  class="form-textarea"
                  rows="8"
                ></textarea>
              </div>
            </div>
          {/if}
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" on:click={closeModal}>
            Abbrechen
          </button>
          {#if addType === 'app'}
            <button 
              class="btn btn-primary" 
              on:click={addNewApp}
              disabled={!newAppName.trim() || (newAppType === 'custom' && !newAppUrl.trim()) || (newAppType === 'libreworkspace' && (!newAppDomain.trim() || !newAppAddon.trim()))}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              App installieren
            </button>
          {:else}
            <button 
              class="btn btn-primary" 
              on:click={addNewWidget}
              disabled={!newWidgetTitle.trim() || !newWidgetContent.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
              Widget erstellen
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    height: 100%;
    background: #0d1117;
    color: #f0f6fc;
    overflow-y: auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  }

  .dashboard-header {
    background: #161b22;
    border-bottom: 1px solid #21262d;
    padding: 2rem 2.5rem;
    position: sticky;
    top: 0;
    z-index: 100;
    backdrop-filter: blur(12px);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .header-left {
    display: flex;
    align-items: center;
  }
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .logo {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #7c3aed, #3b82f6);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }
  
  .header-text h1 {
    margin: 0 0 0.25rem 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #f0f6fc;
    letter-spacing: -0.025em;
  }
  
  .header-text p {
    margin: 0;
    color: #8b949e;
    font-size: 0.875rem;
    font-weight: 400;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .add-menu-container {
    position: relative;
  }
  
  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #21262d;
    color: #8b949e;
    border: none;
    border: 1px solid #30363d;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 44px;
    height: 44px;
  }
  
  .add-btn:hover {
    background: #262c36;
    color: #f0f6fc;
    border-color: #3b82f6;
  }
  
  .add-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .add-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    min-width: 180px;
    overflow: hidden;
    animation: slideDown 200ms ease;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.875rem 1rem;
    border: none;
    background: transparent;
    color: #f0f6fc;
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .dropdown-item:hover {
    background: #21262d;
    color: #58a6ff;
  }
  
  .dropdown-item:first-child:hover {
    color: #238636;
  }
  
  .dropdown-item:last-child:hover {
    color: #8b5cf6;
  }
  
  .dashboard-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem;
  }
  
  .apps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .app-card {
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 80px;
    position: relative;
    overflow: hidden;
  }
  
  .app-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #7c3aed, #3b82f6);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .app-card:hover {
    background: #262c36;
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .app-card:hover::before {
    opacity: 1;
  }
  
  .widget-preview {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1rem 0.75rem;
    border-bottom: 1px solid #30363d;
    flex-shrink: 0;
  }
  
  .widget-color-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .widget-title {
    flex: 1;
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #f0f6fc;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .widget-type-badge {
    background: #30363d;
    color: #8b949e;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    flex-shrink: 0;
  }
  
  .widget-content-preview {
    flex: 1;
    padding: 1rem;
    overflow: hidden;
    color: #f0f6fc;
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  
  .markdown-preview {
    height: 100%;
    overflow: hidden;
  }
  
  /* Markdown Styling */
  :global(.widget-content-preview h1) {
    font-size: 1.125rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0 0 0.5rem 0;
  }
  
  :global(.widget-content-preview h2) {
    font-size: 1rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0.75rem 0 0.5rem 0;
  }
  
  :global(.widget-content-preview h3) {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0.5rem 0 0.25rem 0;
  }
  
  :global(.widget-content-preview p) {
    margin: 0 0 0.75rem 0;
    color: #f0f6fc;
  }
  
  :global(.widget-content-preview strong) {
    font-weight: 600;
    color: #f0f6fc;
  }
  
  :global(.widget-content-preview em) {
    font-style: italic;
    color: #8b949e;
  }
  
  :global(.widget-content-preview a) {
    color: #58a6ff;
    text-decoration: none;
  }
  
  :global(.widget-content-preview a:hover) {
    text-decoration: underline;
  }
  
  :global(.widget-content-preview code) {
    background: #21262d;
    color: #79c0ff;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.75rem;
  }
  
  :global(.widget-content-preview blockquote) {
    border-left: 3px solid #30363d;
    padding-left: 0.75rem;
    margin: 0.5rem 0;
    color: #8b949e;
    font-style: italic;
  }
  
  :global(.widget-content-preview ul) {
    padding-left: 1rem;
    margin: 0.5rem 0;
  }
  
  :global(.widget-content-preview li) {
    margin: 0.25rem 0;
    color: #f0f6fc;
  }
  
  :global(.widget-content-preview .checkbox) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
  }
  
  :global(.widget-content-preview .checkbox input) {
    margin: 0;
    accent-color: #238636;
  }
  
  :global(.widget-content-preview .checkbox.checked span) {
    text-decoration: line-through;
    color: #8b949e;
  }
  
  :global(.widget-content-preview hr) {
    border: none;
    height: 1px;
    background: #30363d;
    margin: 0.75rem 0;
  }
  
  .app-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .icon-emoji {
    font-size: 1.5rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }
  
  .app-info {
    flex: 1;
    min-width: 0;
  }
  
  .app-name {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #f0f6fc;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .app-status {
    margin: 0;
    font-size: 0.8125rem;
    color: #8b949e;
    font-weight: 400;
  }
  
  .app-actions {
    flex-shrink: 0;
  }
  
  .action-btn {
    background: #30363d;
    border: 1px solid #3b82f6;
    color: #3b82f6;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
  
  .action-btn:hover {
    background: #3b82f6;
    color: white;
    transform: scale(1.05);
  }
  
  .add-app-card {
    border: 2px dashed #30363d;
    background: transparent;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 120px;
  }
  
  .add-app-card:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .add-widget-card {
    border: 2px dashed #30363d;
    background: transparent;
    justify-content: center;
    text-align: center;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 120px;
  }
  
  .add-widget-card:hover {
    border-color: #8b5cf6;
    background: rgba(139, 92, 246, 0.05);
  }
  
  .add-widget-card:hover .add-icon {
    color: #8b5cf6;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .empty-icon {
    margin-bottom: 2rem;
    color: #30363d;
  }
  
  .empty-state h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #f0f6fc;
  }
  
  .empty-state p {
    margin: 0 0 2rem 0;
    color: #8b949e;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .install-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #238636;
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(35, 134, 54, 0.3);
  }
  
  .install-btn:hover {
    background: #2ea043;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(35, 134, 54, 0.4);
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
  
  .install-modal {
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 12px;
    width: 90%;
    max-width: 700px;
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
    display: flex;
    align-items: center;
    gap: 0.75rem;
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
  
  .templates-section {
    margin-bottom: 2rem;
  }
  
  .templates-section h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #f0f6fc;
  }
  
  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .template-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: #21262d;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 150ms ease;
    color: #f0f6fc;
  }
  
  .template-card:hover {
    background: #262c36;
    border-color: #3b82f6;
    transform: translateY(-1px);
  }
  
  .template-icon {
    font-size: 1.5rem;
  }
  
  .template-name {
    font-size: 0.875rem;
    font-weight: 500;
    text-align: center;
  }
  
  .form-section {
    border-top: 1px solid #30363d;
    padding-top: 2rem;
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
  
  .btn-primary:hover:not(:disabled) {
    background: #2ea043;
    transform: translateY(-1px);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: 1.5rem 1rem;
    }
    
    .header-content {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }
    
    .dashboard-content {
      padding: 1.5rem 1rem;
    }
    
    .apps-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .install-modal {
      width: 95%;
      max-height: 95vh;
    }
    
    .modal-content {
      padding: 1.5rem;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .templates-grid {
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }
  }
</style>