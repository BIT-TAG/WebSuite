<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- src/routes/desktop/+page.svelte -->
<script>
  import { windows, openWindow, closeWindow } from '$lib/stores/windows';
  import Window from '$lib/components/Window.svelte';

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

<button on:click={openExample}>Fenster öffnen</button>
<button on:click={openIframeApp}>Wikipedia öffnen</button>

{#each $windows as win (win.id)}
  <Window {...win} onClose={closeWindow}>
    {#if win.iframeSrc}
      <iframe src={win.iframeSrc} style="width:100%; height:100%;" sandbox="allow-scripts allow-same-origin" />
    {:else}
      <p>{win.content}</p>
    {/if}
  </Window>
{/each}
