<!-- src/lib/components/Dashboard.svelte -->
<script>
  import { windows, openWindow } from '$lib/stores/windows';
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
  <div class="dashboard-header">
    <h2>Dashboard</h2>
    <p>Wählen Sie eine App aus</p>
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

</div>

<style>
  .dashboard {
    height: 100%;
    padding: 3rem 2rem;
    background: var(--bg-secondary);
    overflow-y: auto;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .dashboard-header h2 {
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    font-size: 2.25rem;
    font-weight: 300;
    letter-spacing: -0.025em;
  }

  .dashboard-header p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1.125rem;
    font-weight: 400;
  }

  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.25rem;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }

  .app-card {
    background: var(--bg-primary);
    border-radius: 16px;
    padding: 2rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 2px solid transparent;
    position: relative;
  }

  .app-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: var(--border-medium);
  }

  .app-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .app-name {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .app-menu-container {
    position: relative;
  }

  .app-menu {
    background: var(--bg-tertiary);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--text-secondary);
    transition: all 0.2s ease;
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
    border: 1px solid var(--border-light);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 200px;
    overflow: hidden;
  }

  .context-menu button {
    display: block;
    width: 100%;
    padding: 0.875rem 1.25rem;
    border: none;
    background: var(--bg-primary);
    text-align: left;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: background-color 0.2s ease;
    font-weight: 400;
  }

  .context-menu button:hover {
    background: var(--bg-hover);
  }

  .context-menu button:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }
</style>