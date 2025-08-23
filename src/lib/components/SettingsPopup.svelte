<!-- src/lib/components/SettingsPopup.svelte -->
<script>
  import { settings, setTheme, setAccentColor } from '$lib/stores/settings';
  
  export let isOpen = false;
  export let onClose;
  
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
</script>

{#if isOpen}
  <div class="settings-overlay" on:click={handleOverlayClick}>
    <div class="settings-popup" on:click|stopPropagation>
      <div class="settings-header">
        <h3>⚙️ Einstellungen</h3>
        <button class="close-btn" on:click={onClose}>✖</button>
      </div>
      
      <div class="settings-content">
        <!-- Theme Settings -->
        <div class="setting-group">
          <h4>🎨 Design</h4>
          
          <div class="setting-item">
            <label>Theme</label>
            <div class="theme-options">
              <button 
                class="theme-btn"
                class:active={$settings.theme === 'light'}
                on:click={() => setTheme('light')}
              >
                ☀️ Hell
              </button>
              <button 
                class="theme-btn"
                class:active={$settings.theme === 'dark'}
                on:click={() => setTheme('dark')}
              >
                🌙 Dunkel
              </button>
            </div>
          </div>
          
          <div class="setting-item">
            <label>Akzentfarbe</label>
            <div class="color-options">
              {#each accentColors as color}
                <button 
                  class="color-btn"
                  class:active={$settings.accentColor === color.value}
                  style="background-color: {color.color}"
                  on:click={() => setAccentColor(color.value)}
                  title={color.name}
                >
                  {#if $settings.accentColor === color.value}
                    ✓
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
        
        <!-- Future settings can be added here -->
        <div class="setting-group">
          <h4>ℹ️ Info</h4>
          <p class="info-text">
            WebSuite v1.0<br>
            Moderne Desktop-Umgebung im Browser
          </p>
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
  
  .settings-popup {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 2);
    width: 90%;
    max-width: 480px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .settings-header {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
  }
  
  .settings-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.25rem;
    font-weight: 500;
  }
  
  .close-btn {
    background: var(--bg-secondary);
    border: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.5rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 1rem;
    transition: all 150ms ease;
  }
  
  .close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .settings-content {
    padding: 2rem;
    overflow-y: auto;
    max-height: calc(80vh - 5rem);
  }
  
  .setting-group {
    margin-bottom: 2rem;
  }
  
  .setting-group:last-child {
    margin-bottom: 0;
  }
  
  .setting-group h4 {
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 500;
  }
  
  .setting-item {
    margin-bottom: 1.5rem;
  }
  
  .setting-item:last-child {
    margin-bottom: 0;
  }
  
  .setting-item label {
    display: block;
    margin-bottom: 0.75rem;
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .theme-options {
    display: flex;
    gap: 0.75rem;
  }
  
  .theme-btn {
    flex: 1;
    padding: 0.875rem 1.25rem;
    border: 1px solid var(--border);
    background: var(--bg-primary);
    color: var(--text-muted);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .theme-btn:hover {
    border-color: var(--accent-color);
    background: var(--bg-hover);
  }
  
  .theme-btn.active {
    border-color: var(--accent-color);
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .color-options {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .color-btn {
    width: 48px;
    height: 48px;
    border: 2px solid transparent;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-foreground);
    font-weight: 600;
    font-size: 1rem;
  }
  
  .color-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  
  .color-btn.active {
    border-color: var(--ring);
    transform: scale(1.1);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  
  .info-text {
    color: var(--text-muted);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }
</style>