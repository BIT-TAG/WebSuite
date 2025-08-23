<script>
  import { windows, openWindow, closeWindow } from '$lib/stores/windows';
  import { currentView, switchToDesktop, switchToDashboard, switchToKanban } from '$lib/stores/view';
  import { settings } from '$lib/stores/settings';
  import Window from '$lib/components/Window.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import KanbanBoard from '$lib/components/KanbanBoard.svelte';
  import PomodoroTimer from '$lib/components/PomodoroTimer.svelte';
  import PomodoroMenuBar from '$lib/components/PomodoroMenuBar.svelte';
  import SettingsPopup from '$lib/components/SettingsPopup.svelte';
  import { Button, Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/ui';
  import { Settings } from 'lucide-svelte';
  
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

  // Apply theme classes
  $: if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', $settings.theme === 'dark');
    document.documentElement.setAttribute('data-accent', $settings.accentColor);
  }
</script>

<div class="flex h-screen flex-col bg-background">
  <!-- Navigation Header -->
  <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="flex h-14 items-center justify-between px-6">
      <Tabs value={$currentView} class="w-auto">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger 
            value="desktop" 
            on:click={switchToDesktop}
            class="flex items-center gap-2"
          >
            🖥️ Desktop
            {#if $windows.length > 0}
              <span class="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {$windows.length}
              </span>
            {/if}
          </TabsTrigger>
          <TabsTrigger 
            value="dashboard" 
            on:click={switchToDashboard}
            class="flex items-center gap-2"
          >
            📊 Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="kanban" 
            on:click={switchToKanban}
            class="flex items-center gap-2"
          >
            📋 Kanban
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div class="flex items-center gap-4">
        <PomodoroMenuBar />
        <Button 
          variant="ghost" 
          size="icon"
          on:click={() => showSettings = true}
          class="h-8 w-8"
        >
          <Settings class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </header>

  <!-- Content Area -->
  <main class="flex-1 overflow-hidden">
    {#if $currentView === 'desktop'}
      <div class="flex h-full items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div class="text-center">
          <h1 class="mb-8 text-4xl font-light tracking-tight text-foreground">Web Desktop</h1>
          <div class="flex gap-4">
            <Button on:click={openExample} variant="default">
              Fenster öffnen
            </Button>
            <Button on:click={openIframeApp} variant="outline">
              Wikipedia öffnen
            </Button>
          </div>
        </div>
      </div>
    {:else if $currentView === 'dashboard'}
      <Dashboard />
    {:else if $currentView === 'kanban'}
      <KanbanBoard />
    {/if}
  </main>

  <!-- Windows (nur im Desktop-Modus) -->
  {#if $currentView === 'desktop'}
    {#each $windows as win (win.id)}
      <Window {...win} onClose={closeWindow}>
        {#if win.iframeSrc}
          <iframe src={win.iframeSrc} title={win.title} class="h-full w-full border-0" />
        {:else}
          <p class="text-muted-foreground">{win.content}</p>
        {/if}
      </Window>
    {/each}
  {/if}
  
  <SettingsPopup bind:isOpen={showSettings} onClose={() => showSettings = false} />
</div>