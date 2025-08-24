<script>
  import { windows, minimizedWindows, openWindow, closeWindow, restoreWindow } from '$lib/stores/windows';
  import { currentView, switchToDesktop, switchToDashboard, switchToKanban } from '$lib/stores/view';
  import Window from '$lib/components/Window.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import KanbanBoard from '$lib/components/KanbanBoard.svelte';
  import PomodoroTimer from '$lib/components/PomodoroTimer.svelte';
  import PomodoroMenuBar from '$lib/components/PomodoroMenuBar.svelte';
  import SettingsPopup from '$lib/components/SettingsPopup.svelte';
  
  let showSettings = false;
  let count = 0;

  function increment() {
    count += 1;
  }

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

  <div class="content-area">
    {#if $currentView === 'desktop'}
      <div class="desktop-content">
        <h1>Web Desktop</h1>
        <p>Counter: {count}</p>
        <button on:click={increment}>Increment</button>
      </div>
    {:else if $currentView === 'dashboard'}
      <Dashboard />
    {:else if $currentView === 'kanban'}
      <KanbanBoard />
    {/if}
  </div>
  
  {#if $currentView === 'desktop'}
    <div class="taskbar">
      <button on:click={openExample}>Fenster öffnen</button>
      <button on:click={openIframeApp}>Wikipedia öffnen</button>
      
      {#if $minimizedWindows.length > 0}
        <div class="minimized-windows">
          {#each $minimizedWindows as win (win.id)}
            <button class="taskbar-item" on:click={() => restoreWindow(win.id)}>
              {win.title}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if $currentView === 'desktop'}
    {#each $windows as win (win.id)}
      <Window {...win} onClose={closeWindow}>
        {#if win.iframeSrc}
          <iframe src={win.iframeSrc} title={win.title}></iframe>
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: var(--bg-primary);
  }
  
  .nav-header {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }
  
  .nav-switches {
    display: flex;
    gap: 0.25rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    padding: 4px;
    border: 1px solid var(--border);
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .nav-switch {
    background: transparent;
    color: var(--text-secondary);
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 13px;
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
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  
  h1 {
    color: var(--text-primary);
    text-align: center;
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }
  
  p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 1.25rem;
    font-weight: 400;
  }
  
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border-top: 1px solid var(--border);
  }

  .minimized-windows {
    display: flex;
    gap: 0.5rem;
    margin-left: 1rem;
  }

  .taskbar-item {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 200ms ease;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .taskbar-item:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  button {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }
  
  button:hover {
    background: var(--accent-hover);
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.15);
    transform: translateY(-1px);
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  :global(iframe) {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>