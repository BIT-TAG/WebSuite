<!-- Geändert: Form Labels korrekt mit Inputs verbunden -->
<!-- Geändert: Self-closing tags zu korrekten öffnenden/schließenden Tags -->
<script>
  import { settings, setTheme, setAccentColor } from '$lib/stores/settings';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Card } from '$lib/components/ui';
  import { Sun, Moon, Palette } from 'lucide-svelte';
  
  export let isOpen = false;
  export let onClose;
  
  const accentColors = [
    { name: 'Blau', value: 'blue', color: 'hsl(221.2 83.2% 53.3%)' },
    { name: 'Grün', value: 'green', color: 'hsl(142.1 76.2% 36.3%)' },
    { name: 'Lila', value: 'purple', color: 'hsl(262.1 83.3% 57.8%)' },
    { name: 'Orange', value: 'orange', color: 'hsl(24.6 95% 53.1%)' },
    { name: 'Rot', value: 'red', color: 'hsl(0 84.2% 60.2%)' }
  ];
</script>

<Dialog bind:open={isOpen}>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle class="flex items-center gap-2">
        <Palette class="h-5 w-5"></Palette>
        Einstellungen
      </DialogTitle>
    </DialogHeader>
    
    <div class="space-y-6">
      <!-- Theme Settings -->
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-foreground">Design</h4>
        
        <div class="space-y-3">
          <div>
            <label for="theme-selection" class="text-sm text-muted-foreground">
              Theme
            </label>
            <div class="mt-2 flex gap-2">
              <Button 
                variant={$settings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                on:click={() => setTheme('light')}
                class="flex-1"
              >
                <Sun class="mr-2 h-4 w-4"></Sun>
                Hell
              </Button>
              <Button 
                variant={$settings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                on:click={() => setTheme('dark')}
                class="flex-1"
              >
                <Moon class="mr-2 h-4 w-4"></Moon>
                Dunkel
              </Button>
            </div>
          </div>
          
          <div>
            <label for="accent-selection" class="text-sm text-muted-foreground">
              Akzentfarbe
            </label>
            <div class="mt-2 flex gap-2">
              {#each accentColors as color}
                <button 
                  type="button"
                  class="h-10 w-10 rounded-md border-2 transition-all hover:scale-105"
                  class:border-primary={$settings.accentColor === color.value}
                  class:border-border={$settings.accentColor !== color.value}
                  style="background-color: {color.color}"
                  on:click={() => setAccentColor(color.value)}
                  title={color.name}
                >
                  {#if $settings.accentColor === color.value}
                    <span class="text-white">✓</span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Info Section -->
      <Card class="p-4">
        <h4 class="mb-2 text-sm font-medium text-foreground">Info</h4>
        <p class="text-sm text-muted-foreground">
          WebSuite v1.0<br>
          Moderne Desktop-Umgebung im Browser
        </p>
      </Card>
    </div>
    
    <div class="flex justify-end pt-4">
      <Button variant="outline" on:click={onClose}>
        Schließen
      </Button>
    </div>
  </DialogContent>
</Dialog>