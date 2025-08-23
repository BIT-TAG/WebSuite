<!-- src/lib/components/Window.svelte -->
<script>
  import { moveWindow, bringToFront } from '$lib/stores/windows';
  import { onMount, onDestroy } from 'svelte';
  
  export let id;
  export let title;
  export let position;
  export let zIndex;
  export let onClose;

  let offset = { x: 0, y: 0 };
  let dragging = false;

  function handleMouseDown(event) {
    bringToFront(id);
    dragging = true;
    offset = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    };
    event.preventDefault();
  }

  function handleMouseMove(event) {
    if (dragging) {
      moveWindow(id, {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y
      });
    }
  }

  function handleMouseUp() {
    dragging = false;
  }

  onMount(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  
  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  });
</script>

<div
  class="window"
  style="left: {position.x}px; top: {position.y}px; z-index: {zIndex};"
  role="dialog"
  aria-labelledby="title-{id}"
>
  <div class="titlebar" on:mousedown={handleMouseDown} role="none">
    <span id="title-{id}">{title}</span>
    <button on:click={() => onClose(id)} aria-label="Fenster schließen">✖</button>
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .window {
    position: absolute;
    width: 400px;
    height: 300px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    overflow: hidden;
    resize: both;
    min-width: 200px;
    min-height: 150px;
  }
  
  .titlebar {
    background: var(--accent-color);
    color: var(--accent-foreground);
    padding: 0.75rem 1rem;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .titlebar button {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: var(--accent-foreground);
    padding: 0.375rem 0.625rem;
    border-radius: calc(var(--radius) - 2px);
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 150ms ease;
  }
  
  .titlebar button:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  .content {
    height: calc(100% - 3rem);
    padding: 1rem;
    overflow: auto;
    color: var(--text-primary);
  }
</style>
