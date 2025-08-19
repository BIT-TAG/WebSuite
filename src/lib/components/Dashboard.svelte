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
      case 'open':
        launchApp(app);
        break;
      case 'openNewTab':
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
                <button on:click={(e) => handleAppAction(app, 'open', e)}>
                  🖥️ Im Fenster öffnen
                </button>
                <button on:click={(e) => handleAppAction(app, 'openNewTab', e)}>
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

  <div>
    <div class="stat-card">
      <h3>Offene Fenster</h3>
      <div class="stat-value">{$windows.length}</div>
    </div>
  </div>
</div>

<style>
  .dashboard {
    height: 100%;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    overflow-y: auto;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .dashboard-header h2 {
    color: #333;
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
  }

  .dashboard-header p {
    color: #666;
    margin: 0;
  }

  .app-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .app-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
  }

  .app-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  .app-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .app-name {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .app-menu-container {
    position: relative;
  }

  .app-menu {
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    color: #666;
    transition: all 0.2s ease;
  }

  .app-menu:hover {
    background: rgba(0, 0, 0, 0.2);
    color: #333;
  }

  .context-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: 180px;
    overflow: hidden;
  }

  .context-menu button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: white;
    text-align: left;
    cursor: pointer;
    font-size: 0.85rem;
    color: #333;
    transition: background-color 0.2s ease;
  }

  .context-menu button:hover {
    background: #f5f5f5;
  }

  .context-menu button:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  .dashboard-stats {
    display: flex;
    gap: 1rem;
    justify-content: center;
    max-width: 400px;
    margin: 0 auto;
  }

  .stat-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    flex: 1;
    backdrop-filter: blur(10px);
  }

  .stat-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
  }
</style>