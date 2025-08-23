<!-- src/routes/+page.svelte -->
<script>
  import { windows, openWindow, closeWindow } from '$lib/stores/windows';
  import { currentView, switchToDesktop, switchToDashboard, switchToKanban } from '$lib/stores/view';
  import Window from '$lib/components/Window.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import KanbanBoard from '$lib/components/KanbanBoard.svelte';
  import PomodoroTimer from '$lib/components/PomodoroTimer.svelte';
  import PomodoroMenuBar from '$lib/components/PomodoroMenuBar.svelte';

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
    </div>
  </div>

  <!-- Content Area -->
  <div class="content-area">
    {#if $currentView === 'desktop'}
      <div class="desktop-content">
        <h1>Web Desktop</h1>
      </div>
    {:else}
      <Dashboard />
    {:else if $currentView === 'kanban'}
      <KanbanBoard />
    {:else if $currentView === 'pomodoro'}
      <div class="pomodoro-content">
        <PomodoroTimer />
      </div>
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
</div>

<style>
  .desktop {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  
  .nav-header {
    background: rgba(0, 0, 0, 0.9);
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1000;
  }
  
  .nav-switches {
    display: flex;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.25rem;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
  }
  
  .nav-switch {
    background: transparent;
    color: rgba(255, 255, 255, 0.7);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .nav-switch:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .nav-switch.active {
    background: white;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .content-area {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    color: white;
    text-align: center;
    margin: 0;
    font-size: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #45a049;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  
  :global(iframe) {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>