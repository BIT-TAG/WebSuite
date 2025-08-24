<!-- src/lib/components/DashboardTile.svelte -->
<script>
  import { contextMenu, moveItem, resizeItem } from '$lib/stores/widgets';
  import { openWindow } from '$lib/stores/windows';
  import { switchToDesktop } from '$lib/stores/view';
  
  export let item;
  
  let isDragging = false;
  let isResizing = false;
  let dragStart = { x: 0, y: 0 };
  let initialPos = { x: 0, y: 0 };
  
  $: gridStyle = {
    gridColumn: `span ${item.dim.w}`,
    gridRow: `span ${item.dim.h}`,
  };
  
  function handleContextMenu(event) {
    event.preventDefault();
    contextMenu.set({
      open: true,
      x: event.clientX,
      y: event.clientY,
      item: item
    });
  }
  
  function handleKeyDown(event) {
    const isContextKey = (event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu';
    if (isContextKey) {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      contextMenu.set({
        open: true,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        item: item
      });
    }
  }
  
  function handleClick() {
    if (item.kind === 'app') {
      openWindow({
        title: item.name,
        iframeSrc: item.url
      });
      switchToDesktop();
    }
  }
  
  function renderMarkdown(content) {
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="checkbox"><input type="checkbox" disabled> <span>$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="checkbox checked"><input type="checkbox" checked disabled> <span>$1</span></div>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/^---$/gim, '<hr>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }
</script>

<div
  class="tile"
  class:app-tile={item.kind === 'app'}
  class:widget-tile={item.kind === 'widget'}
  style="grid-column: span {item.dim.w}; grid-row: span {item.dim.h};"
  on:contextmenu={handleContextMenu}
  on:keydown={handleKeyDown}
  on:click={handleClick}
  tabindex="0"
  role="button"
  aria-label={item.kind === 'app' ? `App: ${item.name}` : `Widget: ${item.title}`}
>
  {#if item.kind === 'app'}
    <!-- App Content -->
    <div class="app-content">
      <div class="app-icon">
        <span class="icon-emoji">{item.icon}</span>
      </div>
      <div class="app-info">
        <h3 class="app-name">{item.name}</h3>
        <p class="app-description">{item.descriptionShort || 'Keine Beschreibung verfügbar'}</p>
      </div>
    </div>
  {:else if item.kind === 'widget'}
    <!-- Widget Content -->
    <div class="widget-content">
      <div class="widget-body">
        {#if item.widgetType === 'html'}
          {@html item.content}
        {:else if item.widgetType === 'markdown'}
          <div class="markdown-content">
            {@html renderMarkdown(item.content)}
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Resize Handles (nur für Widgets) -->
    <div class="resize-handle bottom-right" title="Größe ändern"></div>
  {/if}
</div>

<style>
  .tile {
    position: relative;
    border-radius: 12px;
    background: #21262d;
    border: 1px solid #30363d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .tile:hover {
    background: #262c36;
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .tile:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6, 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  /* App Styles */
  .app-tile {
    min-height: 96px;
  }
  
  .app-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 1rem;
    text-align: center;
    gap: 0.75rem;
  }
  
  .app-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: transparent;
  }

  
  .icon-emoji {
    font-size: 2.5rem;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }
  
  .app-info {
    flex: 1;
    min-width: 0;
  }
  
  .app-name {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #f0f6fc;
    line-height: 1.2;
    text-align: center;
  }
  
  .app-description {
    margin: 0;
    font-size: 0.6875rem;
    color: #8b949e;
    font-weight: 400;
    line-height: 1.3;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Widget Styles */
  .widget-tile {
    min-height: 96px;
  }
  
  .widget-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .widget-body {
    flex: 1;
    padding: 1rem;
    overflow: hidden;
    color: #f0f6fc;
    font-size: 0.75rem;
    line-height: 1.4;
  }
  
  /* Markdown Content Styling */
  .markdown-content {
    height: 100%;
    overflow: hidden;
  }
  
  :global(.widget-body h1) {
    font-size: 0.875rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0 0 0.5rem 0;
  }
  
  :global(.widget-body h2) {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0.5rem 0 0.375rem 0;
  }
  
  :global(.widget-body h3) {
    font-size: 0.75rem;
    font-weight: 600;
    color: #f0f6fc;
    margin: 0.375rem 0 0.25rem 0;
  }
  
  :global(.widget-body p) {
    margin: 0 0 0.5rem 0;
    color: #f0f6fc;
  }
  
  :global(.widget-body strong) {
    font-weight: 600;
    color: #f0f6fc;
  }
  
  :global(.widget-body em) {
    font-style: italic;
    color: #8b949e;
  }
  
  :global(.widget-body a) {
    color: #58a6ff;
    text-decoration: none;
  }
  
  :global(.widget-body a:hover) {
    text-decoration: underline;
  }
  
  :global(.widget-body code) {
    background: #21262d;
    color: #79c0ff;
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.625rem;
  }
  
  :global(.widget-body blockquote) {
    border-left: 3px solid #30363d;
    padding-left: 0.5rem;
    margin: 0.375rem 0;
    color: #8b949e;
    font-style: italic;
  }
  
  :global(.widget-body ul) {
    padding-left: 1rem;
    margin: 0.375rem 0;
  }
  
  :global(.widget-body li) {
    margin: 0.125rem 0;
    color: #f0f6fc;
  }
  
  :global(.widget-body .checkbox) {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin: 0.25rem 0;
  }
  
  :global(.widget-body .checkbox input) {
    margin: 0;
    accent-color: #238636;
  }
  
  :global(.widget-body .checkbox.checked span) {
    text-decoration: line-through;
    color: #8b949e;
  }
  
  :global(.widget-body hr) {
    border: none;
    height: 1px;
    background: #30363d;
    margin: 0.5rem 0;
  }
  
  /* Resize Handles */
  .resize-handle {
    position: absolute;
    background: #3b82f6;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .tile:hover .resize-handle {
    opacity: 0.7;
  }
  
  .resize-handle:hover {
    opacity: 1;
  }
  
  .resize-handle.bottom-right {
    bottom: 0;
    right: 0;
    width: 12px;
    height: 12px;
    cursor: se-resize;
    border-top-left-radius: 4px;
  }
  
  /* Responsive Adjustments */
  @media (max-width: 768px) {
    .app-icon {
      width: 24px;
      height: 24px;
    }
    
    .icon-emoji {
      font-size: 1rem;
    }
    
    .app-name {
      font-size: 0.6875rem;
    }
    
    .app-status {
      font-size: 0.5625rem;
    }
    
    .widget-title {
      font-size: 0.6875rem;
    }
    
    .widget-body {
      font-size: 0.6875rem;
      padding: 0.5rem;
    }
  }
</style>