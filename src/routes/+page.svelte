<!-- src/routes/+page.svelte -->
<script>
  import { windows, openWindow, closeWindow } from '$lib/stores/windows';
  import { currentView, switchToDesktop, switchToDashboard, switchToKanban } from '$lib/stores/view';
  import Window from '$lib/components/Window.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import KanbanBoard from '$lib/components/KanbanBoard.svelte';
  import PomodoroTimer from '$lib/components/PomodoroTimer.svelte';
  import PomodoroMenuBar from '$lib/components/PomodoroMenuBar.svelte';
  import SettingsPopup from '$lib/components/SettingsPopup.svelte';
  
  let showSettings = false;

  function openExample() {
    openWindow({
      title: 'Info',
      content: 'Willkommen im Web-Desktop!'
    });
  }

  function openIframeApp() {
    openWindow({
      title: 'Wikipedia',
      iframeSrc: 'https://de.wikipedia.org'
    });
  }
</script>

<div class="desktop">
  <!-- Navigation Header -->
  <div class="nav-header">
    <div class="nav-switches">
      <button 
        class="nav-switch" 
        class:active={$currentView === 'desktop'}
        on:click={switchToDesktop}
      >
        🖥️ Desktop {$windows.length}
      </button>
      <button 
        class="nav-switch" 
        class:active={$currentView === 'dashboard'}
        on:click={switchToDashboard}
      >
        📊 Dashboard
      </button>
      <button 
        class="nav-switch" 
        class:active={$currentView === 'kanban'}
        on:click={switchToKanban}
      >
        📋 Kanban
      </button>
    </div>
    
    <div class="nav-right">
      <PomodoroMenuBar />
      <button class="settings-btn" on:click={() => showSettings = true} title="Einstellungen">
        ⚙️
      </button>
    </div>
  </div>

  <!-- Content Area -->
  <div class="content-area">
    {#if $currentView === 'desktop'}
      <div class="desktop-content">
        <h1>Web Desktop</h1>
      </div>
    {:else if $currentView === 'dashboard'}
      <Dashboard />
    {:else if $currentView === 'kanban'}
      <KanbanBoard />
    {/if}
  </div>
  
  <!-- Taskbar (nur im Desktop-Modus) -->
  {#if $currentView === 'desktop'}
    <div class="taskbar">
      <button on:click={openExample}>Fenster öffnen</button>
      <button on:click={openIframeApp}>Wikipedia öffnen</button>
    </div>
  {/if}

  <!-- Fenster nur im Desktop-Modus anzeigen -->
  {#if $currentView === 'desktop'}
    {#each $windows as win (win.id)}
      <Window {...win} onClose={closeWindow}>
        {#if win.iframeSrc}
          <iframe src={win.iframeSrc} title={win.title} />
        {:else}
          <p>{win.content}</p>
        {/if}
      </Window>
    {/each}
  {/if}
  
  <SettingsPopup bind:isOpen={showSettings} onClose={() => showSettings = false} />
</div>

<style>
  .desktop {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-secondary);
  }
  
  .nav-header {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
  
  .nav-switches {
    display: flex;
    gap: 0.125rem;
    background: var(--bg-secondary);
    border-radius: var(--radius);
    padding: 0.25rem;
    border: 1px solid var(--border);
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .nav-switch {
    background: transparent;
    color: var(--text-muted);
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 0.8125rem;
    font-weight: 500;
    white-space: nowrap;
    position: relative;
  }
  
  .nav-switch:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .nav-switch.active {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    font-weight: 500;
  }
  
  .settings-btn {
    background: var(--bg-secondary);
    border: none;
    border: 1px solid var(--border);
    color: var(--text-muted);
    padding: 0.5rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 1.125rem;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
  }
  
  .settings-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--border-medium);
  }
  
  .content-area {
    flex: 1;
    position: relative;
  }
  
  .desktop-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pomodoro-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  h1 {
    color: var(--text-primary);
    text-align: center;
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }
  
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
    border-top: 1px solid var(--border);
  }
  
  button {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 150ms ease;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
  
  button:hover {
    background: var(--accent-hover);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-feature-settings: 'cv11', 'ss01';
    font-variation-settings: 'opsz\' 32;
  }
  
  :global(iframe) {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  /* Dark theme support for nav header */
  :global(.dark-theme) .nav-switches {
    background: var(--bg-tertiary);
  }