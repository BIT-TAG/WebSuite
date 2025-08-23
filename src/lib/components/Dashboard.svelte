<script>
  import { windows, openWindow } from '$lib/stores/windows';
  import { switchToDesktop } from '$lib/stores/view';
  import { Button, Card } from '$lib/components/ui';
  import { MoreVertical, ExternalLink, Info, Monitor } from 'lucide-svelte';
  import { DropdownMenu } from "bits-ui";
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

  function launchApp(app) {
    openWindow({
      title: app.name,
      iframeSrc: app.url
    });
    switchToDesktop();
  }

  function handleAppAction(app, action) {
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
</script>

<div class="h-full overflow-auto bg-background p-8">
  <div class="mx-auto max-w-6xl">
    <div class="mb-12 text-center">
      <h2 class="mb-4 text-3xl font-light tracking-tight text-foreground">Dashboard</h2>
      <p class="text-lg text-muted-foreground">Wählen Sie eine App aus</p>
    </div>
    
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each dashboardApps as app}
        <Card class="group relative overflow-hidden transition-all hover:shadow-lg">
          <button 
            class="flex h-full w-full flex-col items-center justify-center p-6 text-center transition-colors hover:bg-muted/50"
            on:click={() => launchApp(app)}
          >
            <div class="mb-4 text-4xl">{app.icon}</div>
            <h3 class="font-medium text-foreground">{app.name}</h3>
          </button>
          
          <div class="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
                  <MoreVertical class="h-4 w-4" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-48 rounded-md border bg-popover p-1 shadow-md">
                <DropdownMenu.Item 
                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  on:click={() => handleAppAction(app, 'window')}
                >
                  <Monitor class="h-4 w-4" />
                  Im Fenster öffnen
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  on:click={() => handleAppAction(app, 'tab')}
                >
                  <ExternalLink class="h-4 w-4" />
                  In neuem Tab öffnen
                </DropdownMenu.Item>
                <DropdownMenu.Item 
                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  on:click={() => handleAppAction(app, 'info')}
                >
                  <Info class="h-4 w-4" />
                  App-Info
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </Card>
      {/each}
    </div>
  </div>
</div>