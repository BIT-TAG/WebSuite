<!-- src/routes/+page.svelte -->
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

<div class="desktop">
  <h1>Web Desktop</h1>
  
  <div class="taskbar">
    <button on:click={openExample}>Fenster öffnen</button>
    <button on:click={openIframeApp}>Wikipedia öffnen</button>
  </div>

  {#each $windows as win (win.id)}
    <Window {...win} onClose={closeWindow}>
      {#if win.iframeSrc}
        <iframe src={win.iframeSrc} title={win.title} />
      {:else}
        <p>{win.content}</p>
      {/if}
    </Window>
  {/each}
</div>

<style>
  .desktop {
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
  }
  
  h1 {
    color: white;
    text-align: center;
    padding: 1rem;
    margin: 0;
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