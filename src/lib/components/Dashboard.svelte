<!-- src/lib/components/Dashboard.svelte -->
<script>
  import { windows, openWindow } from '$lib/stores/windows';

  const dashboardApps = [
    { name: 'Wikipedia', icon: '📚', url: 'https://de.wikipedia.org' },
    { name: 'Calculator', icon: '🧮', content: 'Taschenrechner-App' },
    { name: 'Notes', icon: '📝', content: 'Notizen-App' },
    { name: 'Weather', icon: '🌤️', content: 'Wetter-App' },
    { name: 'Calendar', icon: '📅', content: 'Kalender-App' },
    { name: 'Music', icon: '🎵', content: 'Musik-App' }
  ];

  function launchApp(app) {
    if (app.url) {
      openWindow({
        title: app.name,
        iframeSrc: app.url
      });
    } else {
      openWindow({
        title: app.name,
        content: app.content
      });
    }
  }
</script>

<div class="dashboard">
  <div class="dashboard-header">
    <h2>Dashboard</h2>
    <p>Wählen Sie eine App aus</p>
  </div>
  
  <div class="app-grid">
    {#each dashboardApps as app}
      <div class="app-card" on:click={() => launchApp(app)} role="button" tabindex="0">
        <div class="app-icon">{app.icon}</div>
        <div class="app-name">{app.name}</div>
      </div>
    {/each}
  </div>

  <div class="dashboard-stats">
    <div class="stat-card">
      <h3>Offene Fenster</h3>
      <div class="stat-value">{$windows.length}</div>
    </div>
    <div class="stat-card">
      <h3>Verfügbare Apps</h3>
      <div class="stat-value">{dashboardApps.length}</div>
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