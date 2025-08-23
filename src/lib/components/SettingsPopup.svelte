<!-- src/lib/components/SettingsPopup.svelte -->
<script>
  import { settings, setTheme, setAccentColor } from '$lib/stores/settings';
  
  export let isOpen = false;
  export let onClose;
  
  let activeTab = 'design';
  
  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'workspace', label: 'LibreWorkspace', icon: '💼' },
    { id: 'subscription', label: 'Abo', icon: '💳' }
  ];
  
  const accentColors = [
    { name: 'Blau', value: 'blue', color: '#3b82f6' },
    { name: 'Grün', value: 'green', color: '#10b981' },
    { name: 'Lila', value: 'purple', color: '#8b5cf6' },
    { name: 'Orange', value: 'orange', color: '#f59e0b' },
    { name: 'Rot', value: 'red', color: '#ef4444' }
  ];
  
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
  
  function selectTab(tabId) {
    activeTab = tabId;
  }
</script>

{#if isOpen}
  <div class="settings-overlay" on:click={handleOverlayClick}>
    <div class="settings-window" on:click|stopPropagation>
      <!-- Window Controls -->
      <div class="window-controls">
        <div class="traffic-lights">
          <button class="control-btn close" on:click={onClose}></button>
          <button class="control-btn minimize"></button>
          <button class="control-btn maximize"></button>
        </div>
        <div class="window-title">Einstellungen</div>
        <div class="spacer"></div>
      </div>
      
      <div class="settings-content">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="sidebar-content">
            {#each tabs as tab}
              <button 
                class="sidebar-item"
                class:active={activeTab === tab.id}
                on:click={() => selectTab(tab.id)}
              >
                <span class="sidebar-icon">{tab.icon}</span>
                <span class="sidebar-label">{tab.label}</span>
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
          <div class="content-header">
            <h2 class="content-title">
              {tabs.find(t => t.id === activeTab)?.icon}
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          
          <div class="content-body">
            {#if activeTab === 'account'}
              <div class="settings-section">
                <div class="profile-card">
                  <div class="profile-avatar">
                    <div class="avatar-placeholder">JD</div>
                  </div>
                  <div class="profile-info">
                    <h3>John Doe</h3>
                    <p>john.doe@example.com</p>
                    <span class="account-status">Aktiv</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Vollständiger Name</label>
                  <input type="text" value="John Doe" class="form-input" />
                </div>
                
                <div class="form-group">
                  <label>E-Mail-Adresse</label>
                  <input type="email" value="john.doe@example.com" class="form-input" />
                </div>
                
                <div class="form-group">
                  <label>Passwort</label>
                  <button class="secondary-btn">Passwort ändern</button>
                </div>
                
                <div class="form-group">
                  <button class="danger-btn">Account löschen</button>
                </div>
              </div>
              
            {:else if activeTab === 'design'}
              <div class="settings-section">
                <div class="form-group">
                  <label>Erscheinungsbild</label>
                  <div class="theme-selector">
                    <button 
                      class="theme-option"
                      class:active={$settings.theme === 'light'}
                      on:click={() => setTheme('light')}
                    >
                      <div class="theme-preview light-preview"></div>
                      <span>Hell</span>
                    </button>
                    <button 
                      class="theme-option"
                      class:active={$settings.theme === 'dark'}
                      on:click={() => setTheme('dark')}
                    >
                      <div class="theme-preview dark-preview"></div>
                      <span>Dunkel</span>
                    </button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Akzentfarbe</label>
                  <div class="color-grid">
                    {#each accentColors as color}
                      <button 
                        class="color-option"
                        class:active={$settings.accentColor === color.value}
                        style="background-color: {color.color}"
                        on:click={() => setAccentColor(color.value)}
                        title={color.name}
                      >
                        {#if $settings.accentColor === color.value}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <polyline points="20,6 9,17 4,12"/>
                          </svg>
                        {/if}
                      </button>
                    {/each}
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Schriftgröße</label>
                  <select class="form-select">
                    <option>Klein</option>
                    <option selected>Standard</option>
                    <option>Groß</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" checked />
                    <span class="checkmark"></span>
                    Animationen aktivieren
                  </label>
                </div>
              </div>
              
            {:else if activeTab === 'workspace'}
              <div class="settings-section">
                <div class="form-group">
                  <label>Workspace Name</label>
                  <input type="text" value="Mein Workspace" class="form-input" />
                </div>
                
                <div class="form-group">
                  <label>Standard-Ansicht</label>
                  <select class="form-select">
                    <option>Desktop</option>
                    <option>Dashboard</option>
                    <option selected>Kanban</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" checked />
                    <span class="checkmark"></span>
                    Auto-Save aktivieren
                  </label>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                    Benachrichtigungen anzeigen
                  </label>
                </div>
                
                <div class="form-group">
                  <label>Pomodoro Standard-Zeit</label>
                  <div class="time-inputs">
                    <input type="number" value="25" min="1" max="60" class="time-input" />
                    <span>Minuten</span>
                  </div>
                </div>
                
                <div class="form-group">
                  <button class="secondary-btn">Workspace exportieren</button>
                  <button class="secondary-btn">Workspace importieren</button>
                </div>
              </div>
              
            {:else if activeTab === 'subscription'}
              <div class="settings-section">
                <div class="subscription-card">
                  <div class="plan-header">
                    <h3>LibreWorkspace Pro</h3>
                    <div class="plan-badge">Aktiv</div>
                  </div>
                  <div class="plan-price">
                    <span class="price">€9.99</span>
                    <span class="period">/Monat</span>
                  </div>
                  <div class="plan-features">
                    <div class="feature">✓ Unbegrenzte Projekte</div>
                    <div class="feature">✓ Team-Kollaboration</div>
                    <div class="feature">✓ Erweiterte Berichte</div>
                    <div class="feature">✓ Priority Support</div>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Nächste Abrechnung</label>
                  <p class="billing-info">15. Februar 2025</p>
                </div>
                
                <div class="form-group">
                  <label>Zahlungsmethode</label>
                  <div class="payment-method">
                    <div class="card-info">
                      <span class="card-icon">💳</span>
                      <span>•••• •••• •••• 1234</span>
                    </div>
                    <button class="secondary-btn">Ändern</button>
                  </div>
                </div>
                
                <div class="form-group">
                  <button class="secondary-btn">Rechnung herunterladen</button>
                </div>
                
                <div class="form-group danger-zone">
                  <h4>Abo verwalten</h4>
                  <button class="danger-btn">Abo kündigen</button>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .settings-window {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    width: 90%;
    max-width: 900px;
    height: 80vh;
    max-height: 700px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
    display: flex;
    flex-direction: column;
  }
  
  .window-controls {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    min-height: 44px;
  }
  
  .traffic-lights {
    display: flex;
    gap: 8px;
  }
  
  .control-btn {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  .control-btn.close {
    background: #ff5f57;
  }
  
  .control-btn.minimize {
    background: #ffbd2e;
  }
  
  .control-btn.maximize {
    background: #28ca42;
  }
  
  .control-btn:hover {
    opacity: 0.8;
  }
  
  .window-title {
    flex: 1;
    text-align: center;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
  }
  
  .spacer {
    width: 68px;
  }
  
  .settings-content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
  
  .sidebar {
    width: 200px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-content {
    padding: 20px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
    width: 100%;
  }
  
  .sidebar-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .sidebar-item.active {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .sidebar-icon {
    font-size: 16px;
    width: 20px;
    text-align: center;
  }
  
  .sidebar-label {
    flex: 1;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .content-header {
    padding: 24px 32px 16px;
    border-bottom: 1px solid var(--border);
  }
  
  .content-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .content-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px 32px;
  }
  
  .settings-section {
    max-width: 500px;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 500;
  }
  
  .form-input,
  .form-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: all 150ms ease;
  }
  
  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }
  
  .profile-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 24px;
  }
  
  .profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-foreground);
    font-weight: 600;
    font-size: 20px;
  }
  
  .profile-info h3 {
    margin: 0 0 4px 0;
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
  }
  
  .profile-info p {
    margin: 0 0 8px 0;
    color: var(--text-secondary);
    font-size: 14px;
  }
  
  .account-status {
    background: #10b981;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .theme-selector {
    display: flex;
    gap: 16px;
  }
  
  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 150ms ease;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
  }
  
  .theme-option:hover {
    border-color: var(--accent-color);
  }
  
  .theme-option.active {
    border-color: var(--accent-color);
    background: var(--accent-light);
    color: var(--accent-color);
  }
  
  .theme-preview {
    width: 60px;
    height: 40px;
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  
  .light-preview {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  }
  
  .dark-preview {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  
  .color-grid {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .color-option {
    width: 44px;
    height: 44px;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-option:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
  }
  
  .color-option.active {
    border-color: var(--ring);
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgb(0 0 0 / 0.15);
  }
  
  .checkbox-label {
    display: flex !important;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    margin-bottom: 0 !important;
  }
  
  .checkbox-label input[type="checkbox"] {
    display: none;
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease;
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkmark {
    background: var(--accent-color);
    border-color: var(--accent-color);
  }
  
  .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
    content: '✓';
    color: var(--accent-foreground);
    font-size: 12px;
    font-weight: 600;
  }
  
  .time-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .time-input {
    width: 80px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
  }
  
  .subscription-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }
  
  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .plan-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 20px;
    font-weight: 600;
  }
  
  .plan-badge {
    background: #10b981;
    color: white;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .plan-price {
    margin-bottom: 20px;
  }
  
  .price {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .period {
    color: var(--text-secondary);
    font-size: 16px;
  }
  
  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .feature {
    color: var(--text-secondary);
    font-size: 14px;
  }
  
  .billing-info {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0;
  }
  
  .payment-method {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  
  .card-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
    font-size: 14px;
  }
  
  .card-icon {
    font-size: 16px;
  }
  
  .secondary-btn {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-primary);
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 150ms ease;
    margin-right: 8px;
  }
  
  .secondary-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  .danger-btn {
    background: #ef4444;
    border: 1px solid #ef4444;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .danger-btn:hover {
    background: #dc2626;
    border-color: #dc2626;
  }
  
  .danger-zone {
    border-top: 1px solid var(--border);
    padding-top: 24px;
    margin-top: 32px;
  }
  
  .danger-zone h4 {
    margin: 0 0 12px 0;
    color: #ef4444;
    font-size: 16px;
    font-weight: 600;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .settings-window {
      width: 95%;
      height: 90vh;
    }
    
    .sidebar {
      width: 160px;
    }
    
    .content-body {
      padding: 20px 24px;
    }
    
    .settings-section {
      max-width: none;
    }
  }
</style>