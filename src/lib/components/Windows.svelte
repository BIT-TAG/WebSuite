<!-- src/lib/components/Window.svelte -->
<script>
  import { moveWindow, bringToFront } from '$lib/stores/windows';
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

  // globales Mouse-Handling
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
</script>

<div
  class="window"
  style="left: {position.x}px; top: {position.y}px; z-index: {zIndex};"
  on:mousedown={() => bringToFront(id)}
>
  <div class="titlebar" on:mousedown={handleMouseDown}>
    <span>{title}</span>
    <button on:click={() => onClose(id)}>✖</button>
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
    background: white;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }
  .titlebar {
    background: #444;
    color: white;
    padding: 0.5rem;
    cursor: move;
    display: flex;
    justify-content: space-between;
    user-select: none;
  }
  .content {
    height: calc(100% - 2rem);
    padding: 0.5rem;
  }
</style>
