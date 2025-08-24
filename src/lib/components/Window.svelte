<!-- src/lib/components/Window.svelte -->
<script>
  import { moveWindow, bringToFront, minimizeWindow, maximizeWindow } from '$lib/stores/windows';
  import { resizeWindow } from '$lib/stores/windows';
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
  let resizing = false;
  let resizeDirection = '';
  let initialSize = { width: 0, height: 0 };
  let initialMousePos = { x: 0, y: 0 };

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

  function handleResizeStart(event, direction) {
    if (isMaximized) return;
    event.stopPropagation();
    bringToFront(id);
    resizing = true;
    resizeDirection = direction;
    initialSize = { width, height };
    initialMousePos = { x: event.clientX, y: event.clientY };
    event.preventDefault();
  }
  function handleMouseMove(event) {
    if (dragging && !isMaximized) {
      event.preventDefault();
      moveWindow(id, {
        x: event.clientX - offset.x,
        y: event.clientY - offset.y
      });
    } else if (resizing && !isMaximized) {
      event.preventDefault();
      const deltaX = event.clientX - initialMousePos.x;
      const deltaY = event.clientY - initialMousePos.y;
      
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = position.x;
      let newY = position.y;
      
      if (resizeDirection.includes('right')) {
        newWidth = Math.max(200, initialSize.width + deltaX);
      }
      if (resizeDirection.includes('left')) {
        newWidth = Math.max(200, initialSize.width - deltaX);
        newX = position.x + (initialSize.width - newWidth);
      }
      if (resizeDirection.includes('bottom')) {
        newHeight = Math.max(150, initialSize.height + deltaY);
      }
      if (resizeDirection.includes('top')) {
        newHeight = Math.max(150, initialSize.height - deltaY);
        newY = position.y + (initialSize.height - newHeight);
      }
      
      resizeWindow(id, newWidth, newHeight);
      if (newX !== position.x || newY !== position.y) {
        moveWindow(id, { x: newX, y: newY });
      }
    }
  }

  function handleMouseUp() {
    dragging = false;
    resizing = false;
    resizeDirection = '';
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
    document.addEventListener('selectstart', (e) => {
      if (dragging || resizing) e.preventDefault();
    });
  });
  
  onDestroy(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  });
</script>

<div
  class="window"
  style="transform: translate({position.x}px, {position.y}px); width: {width}px; height: {height}px; z-index: {zIndex};"
  class:maximized={isMaximized}
  class:dragging
  class:resizing
  role="dialog"
  aria-labelledby="title-{id}"
>
  <!-- Resize Handles -->
  {#if !isMaximized}
    <!-- Ecken -->
    <div class="resize-handle corner top-left" on:mousedown={(e) => handleResizeStart(e, 'top-left')}></div>
    <div class="resize-handle corner top-right" on:mousedown={(e) => handleResizeStart(e, 'top-right')}></div>
    <div class="resize-handle corner bottom-left" on:mousedown={(e) => handleResizeStart(e, 'bottom-left')}></div>
    <div class="resize-handle corner bottom-right" on:mousedown={(e) => handleResizeStart(e, 'bottom-right')}></div>
    
    <!-- Kanten -->
    <div class="resize-handle edge top" on:mousedown={(e) => handleResizeStart(e, 'top')}></div>
    <div class="resize-handle edge bottom" on:mousedown={(e) => handleResizeStart(e, 'bottom')}></div>
    <div class="resize-handle edge left" on:mousedown={(e) => handleResizeStart(e, 'left')}></div>
    <div class="resize-handle edge right" on:mousedown={(e) => handleResizeStart(e, 'right')}></div>
  {/if}
  
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
    top: 0;
    left: 0;
    background: var(--ws-surface, var(--bg-primary));
    border: 1px solid var(--ws-border, var(--border));
    border-radius: var(--ws-radius, 12px);
    box-shadow: var(--ws-shadow-3, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1));
    overflow: hidden;
    min-width: 200px;
    min-height: 150px;
    will-change: transform;
    backface-visibility: hidden;
    transform-origin: top left;
    transition: box-shadow var(--ws-transition, 160ms cubic-bezier(0.2, 0.7, 0.2, 1));
  }
  
  .window:not(.dragging):not(.resizing) {
    transition: transform var(--ws-transition, 160ms cubic-bezier(0.2, 0.7, 0.2, 1)), 
                box-shadow var(--ws-transition, 160ms cubic-bezier(0.2, 0.7, 0.2, 1));
  }
  
  .window.dragging,
  .window.resizing {
    transition: none;
    pointer-events: auto;
    box-shadow: var(--ws-shadow-4, 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1));
  }

  .window.maximized {
    border-radius: 0 !important;
    box-shadow: none;
    top: 80px !important;
    left: 0 !important;
    width: 100vw !important;
    height: calc(100vh - 80px) !important;
  }
  
  .titlebar {
    background: var(--ws-surface, #000000);
    color: var(--ws-text, #ffffff);
    padding: 0;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    font-family: var(--ws-font-sans, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif);
    font-weight: var(--ws-font-medium, 500);
    font-size: var(--ws-text-sm, 0.875rem);
    border-bottom: 1px solid var(--ws-border-subtle, var(--border));
    will-change: auto;
    backdrop-filter: saturate(160%) blur(20px);
    -webkit-backdrop-filter: saturate(160%) blur(20px);
    border-top-left-radius: var(--ws-radius, 12px);
    border-top-right-radius: var(--ws-radius, 12px);
  }
  
  .window:not(.maximized) .titlebar {
    cursor: move;
  }
  
  .window-title {
    padding-left: var(--ws-space-4, 16px);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: var(--ws-font-medium, 500);
  }
  
  .window-controls {
    display: flex;
    height: 100%;
  }
  
  .control-btn {
    background: transparent;
    border: none;
    color: var(--ws-text, #ffffff);
    width: 48px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--ws-transition-fast, 100ms cubic-bezier(0.2, 0.7, 0.2, 1));
    border-radius: 0;
    position: relative;
  }
  
  .control-btn:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--ws-accent, #2563EB);
  }
  
  .control-btn:hover {
    background: var(--ws-subtle, rgba(255, 255, 255, 0.1));
  }
  
  .minimize-btn:hover {
    background: var(--ws-subtle, rgba(255, 255, 255, 0.1));
  }
  
  .maximize-btn:hover {
    background: var(--ws-subtle, rgba(255, 255, 255, 0.1));
  }
  
  .maximize-btn {
    border-top-right-radius: var(--ws-radius, 12px);
  }
  
  .close-btn:hover {
    background: var(--ws-error, #e81123);
    color: white;
  }
  
  .close-btn {
    border-top-right-radius: var(--ws-radius, 12px);
  }
  
  .window.maximized .control-btn {
    border-radius: 0;
  }
  
  .content {
    height: calc(100% - 40px);
    padding: var(--ws-space-4, 1rem);
    overflow: auto;
    color: var(--ws-text, var(--text-primary));
    background: var(--ws-surface, var(--bg-primary));
    font-family: var(--ws-font-sans, "Segoe UI Variable", "Segoe UI", system-ui, sans-serif);
    line-height: var(--ws-leading-normal, 1.5);
  }
  
  /* Resize Handles */
  .resize-handle {
    position: absolute;
    z-index: 10;
  }
  
  .resize-handle.corner {
    width: 10px;
    height: 10px;
  }
  
  .resize-handle.edge {
    background: transparent;
  }
  
  .resize-handle.top-left {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }
  
  .resize-handle.top-right {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }
  
  .resize-handle.bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }
  
  .resize-handle.bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
  
  .resize-handle.top {
    top: -5px;
    left: 10px;
    right: 10px;
    height: 10px;
    cursor: n-resize;
  }
  
  .resize-handle.bottom {
    bottom: -5px;
    left: 10px;
    right: 10px;
    height: 10px;
    cursor: s-resize;
  }
  
  .resize-handle.left {
    left: -5px;
    top: 10px;
    bottom: 10px;
    width: 10px;
    cursor: w-resize;
  }
  
  .resize-handle.right {
    right: -5px;
    top: 10px;
    bottom: 10px;
    width: 10px;
    cursor: e-resize;
  }
</style>
