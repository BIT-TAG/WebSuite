<!-- src/lib/components/Window.svelte -->
<script>
  import { moveWindow, bringToFront, minimizeWindow, maximizeWindow } from '$lib/stores/windows';
  import { onMount, onDestroy } from 'svelte';
  
  export let id;
  export let title;
  export let position;
  export let width = 320;
  export let height = 240;
  export let isMaximized = false;
  export let zIndex;
  export let onClose;

  let offset = { x: 0, y: 0 };
  let dragging = false;

  function handleMouseDown(event) {
    if (isMaximized) return; // Kein Drag wenn maximiert
    bringToFront(id);
    dragging = true;
    offset = {
      x: event.clientX - position.x,
      y: event.clientY - position.y
    };
    event.preventDefault();
  }

  function handleMouseMove(event) {
    if (dragging && !isMaximized) {
      moveWindow(id, {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y
      });
    }
  }

  function handleMouseUp() {
    dragging = false;
  }

  function handleMinimize() {
    minimizeWindow(id);
  }

  function handleMaximize() {
    maximizeWindow(id);
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
  style="left: {position.x}px; top: {position.y}px; width: {width}px; height: {height}px; z-index: {zIndex};"
  class:maximized={isMaximized}
  role="dialog"
  aria-labelledby="title-{id}"
>
  <div class="titlebar" on:mousedown={handleMouseDown} role="none">
    <span id="title-{id}" class="window-title">{title}</span>
    <div class="window-controls">
      <button class="control-btn minimize-btn" on:click={handleMinimize} aria-label="Minimieren">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M0,5 L10,5" stroke="currentColor" stroke-width="1"/>
        </svg>
      </button>
      <button class="control-btn maximize-btn" on:click={handleMaximize} aria-label={isMaximized ? 'Wiederherstellen' : 'Maximieren'}>
        {#if isMaximized}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="2" y="0" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
            <rect x="0" y="2" width="8" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
          </svg>
        {:else}
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="0" y="0" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1"/>
          </svg>
        {/if}
      </button>
      <button class="control-btn close-btn" on:click={() => onClose(id)} aria-label="Schließen">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M0,0 L10,10 M10,0 L0,10" stroke="currentColor" stroke-width="1"/>
        </svg>
      </button>
    </div>
  </div>
  <div class="content">
    <slot />
  </div>
</div>

<style>
  .window {
    position: absolute;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    min-width: 200px;
    min-height: 150px;
    transition: all 0.2s ease;
  }

  .window.maximized {
    border-radius: 0;
    box-shadow: none;
  }
  
  .titlebar {
    background: #000000;
    color: #ffffff;
    padding: 0;
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-weight: 400;
    font-size: 0.8125rem;
    border-bottom: 1px solid var(--border);
  }
  
  .window:not(.maximized) .titlebar {
    cursor: move;
  }
  
  .window-title {
    padding-left: 12px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .window-controls {
    display: flex;
    height: 100%;
  }
  
  .control-btn {
    background: transparent;
    border: none;
    color: #ffffff;
    width: 46px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 150ms ease;
  }
  
  .control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .minimize-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .maximize-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .close-btn:hover {
    background: #e81123;
  }
  
  .content {
    height: calc(100% - 32px);
    padding: 1rem;
    overflow: auto;
    color: var(--text-primary);
  }
</style>
