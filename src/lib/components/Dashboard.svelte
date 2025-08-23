<script>
  import { widgets, addWidget } from '$lib/stores/widgets';
  import { windows, openWindow } from '$lib/stores/windows';
  import { switchToDesktop } from '$lib/stores/view';
  import Widget from './Widget.svelte';

  const quickApps = [
    { name: 'Wikipedia', icon: '📚', url: 'https://de.wikipedia.org', color: '#3b82f6' },
    { name: 'Calculator', icon: '🧮', url: 'https://www.calculator.net', color: '#10b981' },
    { name: 'Notes', icon: '📝', url: 'https://keep.google.com', color: '#f59e0b' },
    { name: 'Weather', icon: '🌤️', url: 'https://weather.com', color: '#8b5cf6' },
    { name: 'Calendar', icon: '📅', url: 'https://calendar.google.com', color: '#ef4444' },
    { name: 'GitHub', icon: '💻', url: 'https://github.com', color: '#6b7280' }
  ];

  let showAddWidget = false;
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
      iframeSrc: app.url
    });
    switchToDesktop();
  }

  function addNewWidget() {
    if (newWidgetTitle.trim() && newWidgetContent.trim()) {
      addWidget({
        title: newWidgetTitle.trim(),
        type: newWidgetType,
        content: newWidgetContent.trim(),
        color: newWidgetColor
      });
      resetForm();
      showAddWidget = false;
    }
  }

  function useTemplate(template) {
    newWidgetTitle = template.name;
    newWidgetType = template.type;
    newWidgetContent = template.content;
  }

  function resetForm() {
    newWidgetTitle = '';
    newWidgetContent = '';
    newWidgetType = 'markdown';
    newWidgetColor = 'blue';
  }

  function closeModal() {
    showAddWidget = false;
    resetForm();
  }

  $: visibleWidgets = $widgets.filter(w => w.visible);
  $: totalItems = visibleWidgets.length + quickApps.length;
</script>

<div class="dashboard">
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
        <button class="add-app-btn" on:click={() => showAddWidget = true}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          App hinzufügen
        </button>
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
        <button class="install-btn" on:click={() => showAddWidget = true}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Erste App installieren
        </button>
      </div>
    {:else}
      <div class="apps-grid">
        <!-- Quick Apps -->
        {#each quickApps as app}
          <div class="app-card" on:click={() => launchApp(app)}>
            <div class="app-icon" style="background: {app.color}">
              <span class="icon-emoji">{app.icon}</span>
            </div>
            <div class="app-info">
              <h3 class="app-name">{app.name}</h3>
              <p class="app-status">Installiert</p>
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
            <div class="app-icon widget-icon" style="background: {colorOptions.find(c => c.value === widget.color)?.color || '#3b82f6'}">
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
        
        <!-- Add App Card -->
        <div class="app-card add-app-card" on:click={() => showAddWidget = true}>
          <div class="add-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <div class="add-text">
            <h3>App hinzufügen</h3>
            <p>Neue App installieren</p>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if showAddWidget}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="install-modal" on:click|stopPropagation>
        <div class="modal-header">
          <div class="modal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            App installieren
          </div>
          <button class="close-btn" on:click={closeModal}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="templates-section">
            <h4>App-Vorlagen</h4>
            <div class="templates-grid">
              {#each widgetTemplates as template}
                <button 
                  class="template-card"
                  on:click={() => useTemplate(template)}
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
                <label for="app-name">App Name</label>
                <input 
                  id="app-name"
                  type="text" 
                  bind:value={newWidgetTitle}
                  placeholder="Meine App..."
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="app-type">App Typ</label>
                <select id="app-type" bind:value={newWidgetType} class="form-select">
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>App Farbe</label>
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
              <label for="app-content">App Inhalt</label>
              <textarea 
                id="app-content"
                bind:value={newWidgetContent}
                placeholder={newWidgetType === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
                class="form-textarea"
                rows="8"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-secondary" on:click={closeModal}>
            Abbrechen
          </button>
          <button 
            class="btn btn-primary" 
            on:click={addNewWidget}
            disabled={!newWidgetTitle.trim() || !newWidgetContent.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            App installieren
          </button>
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
  
  .add-app-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #238636;
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .add-app-btn:hover {
    background: #2ea043;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(35, 134, 54, 0.3);
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
  
  .add-icon {
    color: #8b949e;
    transition: color 0.2s ease;
  }
  
  .add-app-card:hover .add-icon {
    color: #3b82f6;
  }
  
  .add-text h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #f0f6fc;
  }
  
  .add-text p {
    margin: 0;
    font-size: 0.8125rem;
    color: #8b949e;
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