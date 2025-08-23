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
</div>

<style>
  .desktop {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #fafafa;
  }
  
  .nav-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
  }
  
  .nav-switches {
    display: flex;
    gap: 0.25rem;
    background: #f1f5f9;
    border-radius: 12px;
    padding: 0.375rem;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
  }
  
  .nav-switch {
    background: transparent;
    color: #64748b;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.875rem;
    font-weight: 400;
    white-space: nowrap;
  }
  
  .nav-switch:hover {
    background: rgba(255, 255, 255, 0.7);
    color: #334155;
  }
  
  .nav-switch.active {
    background: white;
    color: #0f172a;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-weight: 500;
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
    color: white;
    text-align: center;
    margin: 0;
    font-size: 2.5rem;
    font-weight: 300;
  }
  
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background: #2563eb;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: #fafafa;
  }
  
  :global(iframe) {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>