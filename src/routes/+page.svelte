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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: hsl(210 40% 98%);
  }
  
  .nav-header {
    background: hsl(0 0% 100%);
    border-bottom: 1px solid hsl(214.3 31.8% 91.4%);
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
    background: hsl(210 40% 98%);
    border-radius: 0.5rem;
    padding: 0.25rem;
    border: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .nav-switch {
    background: transparent;
    color: hsl(215.4 16.3% 56.9%);
    border: none;
    padding: 0.5rem 0.75rem;
    border-radius: calc(0.5rem - 2px);
    cursor: pointer;
    transition: all 150ms ease;
    font-size: 0.8125rem;
    font-weight: 500;
    white-space: nowrap;
    position: relative;
  }
  
  .nav-switch:hover {
    background: hsl(210 40% 94%);
    color: hsl(222.2 84% 4.9%);
  }
  
  .nav-switch.active {
    background: hsl(0 0% 100%);
    color: hsl(222.2 84% 4.9%);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    font-weight: 500;
  }
  
  .settings-btn {
    background: hsl(210 40% 98%);
    border: 1px solid hsl(214.3 31.8% 91.4%);
    color: hsl(215.4 16.3% 56.9%);
    padding: 0.5rem;
    border-radius: 0.5rem;
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
    background: hsl(210 40% 94%);
    color: hsl(222.2 84% 4.9%);
    border-color: hsl(217.2 32.6% 25%);
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
    gap: 1rem;
  }
  
  h1 {
    color: hsl(222.2 84% 4.9%);
    text-align: center;
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }
  
  p {
    color: hsl(215.4 16.3% 46.9%);
    margin: 0;
    font-size: 1.125rem;
  }
  
  .taskbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: hsl(0 0% 100%);
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
    border-top: 1px solid hsl(214.3 31.8% 91.4%);
  }
  
  button {
    background: hsl(221.2 83.2% 53.3%);
    color: hsl(210 40% 98%);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 150ms ease;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }
  
  button:hover {
    background: hsl(221.2 83.2% 48%);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: hsl(210 40% 98%);
    color: hsl(222.2 84% 4.9%);
    font-feature-settings: 'cv11', 'ss01';
    font-variation-settings: 'opsz' 32;
  }
  
  :global(iframe) {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  :global(.dark-theme) .nav-switches {
    background: hsl(215 27.9% 16.9%);
  }
</style>