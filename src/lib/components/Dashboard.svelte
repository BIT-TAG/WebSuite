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
      <div class="header-text">
        <h1>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="7" height="9" x="3" y="3" rx="1"/>
            <rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/>
            <rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
          Dashboard
        </h1>
        <p>Ihre persönliche Arbeitsumgebung mit {totalItems} Elementen</p>
      </div>
      
      <div class="header-actions">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{visibleWidgets.length}</span>
            <span class="stat-label">Widgets</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{quickApps.length}</span>
            <span class="stat-label">Apps</span>
          </div>
        </div>
        <button class="add-widget-btn" on:click={() => showAddWidget = true}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Widget hinzufügen
        </button>
      </div>
    </div>
  </div>
  
  <div class="dashboard-content">
    {#if totalItems === 0}
      <div class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect width="7" height="9" x="3" y="3" rx="1"/>
            <rect width="7" height="5" x="14" y="3" rx="1"/>
            <rect width="7" height="9" x="14" y="12" rx="1"/>
            <rect width="7" height="5" x="3" y="16" rx="1"/>
          </svg>
        </div>
        <h3>Dashboard ist leer</h3>
        <p>Erstellen Sie Ihr erstes Widget oder nutzen Sie die Quick Apps.</p>
        <button class="empty-action-btn" on:click={() => showAddWidget = true}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Erstes Widget erstellen
        </button>
      </div>
    {:else}
      <div class="dashboard-grid">
        <!-- Quick Apps -->
        {#each quickApps as app}
          <div class="grid-item app-item">
            <button 
              class="app-card" 
              on:click={() => launchApp(app)}
              style="--app-color: {app.color}"
            >
              <div class="app-icon">{app.icon}</div>
              <div class="app-name">{app.name}</div>
              <div class="app-type">Quick App</div>
            </button>
          </div>
        {/each}
        
        <!-- Widgets -->
        {#each visibleWidgets as widget (widget.id)}
          <div class="grid-item widget-item" class:large={widget.size === 'large'}>
            <Widget {widget} gridMode={true} />
          </div>
        {/each}
        
        <!-- Add Widget Button -->
        <div class="grid-item add-item">
          <button class="add-widget-card" on:click={() => showAddWidget = true}>
            <div class="add-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <div class="add-text">Widget hinzufügen</div>
          </button>
        </div>
      </div>
    {/if}
  </div>

  {#if showAddWidget}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="add-widget-modal" on:click|stopPropagation>
        <div class="modal-header">
          <div class="modal-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="7" height="9" x="3" y="3" rx="1"/>
              <rect width="7" height="5" x="14" y="3" rx="1"/>
              <rect width="7" height="9" x="14" y="12" rx="1"/>
              <rect width="7" height="5" x="3" y="16" rx="1"/>
            </svg>
            Neues Widget erstellen
          </div>
          <button class="close-btn" on:click={closeModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <div class="templates-section">
            <h4>Vorlagen</h4>
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
            </div>
            
            <div class="form-group">
              <label>Farbe</label>
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
              <label for="widget-content">Inhalt</label>
              <textarea 
                id="widget-content"
                bind:value={newWidgetContent}
                placeholder={newWidgetType === 'html' ? 'HTML Code eingeben...' : 'Markdown Text eingeben...'}
                class="form-textarea"
                rows="10"
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
              <path d="M12 5v14M5 12h14"/>
            </svg>
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
    background: var(--bg-primary);
    overflow-y: auto;
  }

  .dashboard-header {
    position: sticky;
    top: 0;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 2rem 2rem 1.5rem;
    z-index: 100;
    backdrop-filter: blur(8px);
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
    gap: 2rem;
  }
  
  .header-text {
    flex: 1;
  }

  .header-text h1 {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  .header-text p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  
  .stats-grid {
    display: flex;
    gap: 1rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
  }
  
  .stat-number {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-color);
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .add-widget-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  
  .add-widget-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
  
  .dashboard-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    align-items: start;
  }
  
  .grid-item {
    min-height: 200px;
  }
  
  .grid-item.large {
    grid-column: span 2;
  }
  
  .grid-item.widget-item {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
  }
  
  .grid-item.widget-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgb(0 0 0 / 0.1);
  }

  .app-card {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 16px;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
    position: relative;
    overflow: hidden;
  }

  .app-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--app-color);
  }

  .app-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgb(0 0 0 / 0.1);
    border-color: var(--app-color);
    background: var(--bg-secondary);
  }

  .app-icon {
    font-size: 2.5rem;
    line-height: 1;
  }

  .app-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 1rem;
    text-align: center;
    line-height: 1.2;
  }
  
  .app-type {
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 500;
  }

  .add-widget-card {
    width: 100%;
    height: 100%;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: var(--bg-primary);
    border: 2px dashed var(--border);
    border-radius: 16px;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-secondary);
  }

  .add-widget-card:hover {
    border-color: var(--accent-color);
    background: var(--bg-secondary);
    color: var(--accent-color);
    transform: translateY(-2px);
  }

  .add-icon {
    opacity: 0.7;
  }

  .add-text {
    font-weight: 600;
    font-size: 0.875rem;
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
    margin-bottom: 1.5rem;
    color: var(--text-muted);
    opacity: 0.5;
  }
  
  .empty-state h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .empty-state p {
    margin: 0 0 2rem 0;
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .empty-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .empty-action-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
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
  
  .add-widget-modal {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 20px;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
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
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
  }

  .modal-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .close-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
  
  .close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--accent-color);
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
    color: var(--text-primary);
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
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  .template-card:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    transform: translateY(-1px);
  }
  
  .template-icon {
    font-size: 1.5rem;
  }
  
  .template-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    text-align: center;
  }
  
  .form-section {
    border-top: 1px solid var(--border);
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
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 0.875rem 1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 200ms ease;
    font-family: inherit;
    outline: none;
  }
  
  .form-textarea {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    resize: vertical;
    min-height: 200px;
    line-height: 1.5;
  }
  
  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.15);
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
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
  }
  
  .color-option.active {
    border-color: var(--bg-primary);
    transform: scale(1.1);
    box-shadow: 0 0 0 2px var(--accent-color);
  }
  
  .modal-actions {
    padding: 1.5rem 2rem 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    background: var(--bg-secondary);
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    border: none;
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
  }
  
  .btn-secondary {
    background: var(--bg-primary);
    color: var(--text-secondary);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--accent-color);
  }
  
  .btn-primary {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .btn-primary:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px -1px rgb(0 0 0 / 0.15);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard-header {
      padding: 1.5rem 1rem 1rem;
    }
    
    .header-content {
      flex-direction: column;
      gap: 1.5rem;
      text-align: center;
    }
    
    .dashboard-content {
      padding: 1.5rem 1rem;
    }
    
    .dashboard-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .grid-item.large {
      grid-column: span 1;
    }
    
    .add-widget-modal {
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