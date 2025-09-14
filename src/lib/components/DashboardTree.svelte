<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { dashboardStructure, viewState, selectNode, toggleNodeExpansion, setZoom, setPan } from '$lib/stores/dashboards';
  import type { DashboardNode } from '$lib/types/dashboard';
  
  export let onNodeClick: (node: DashboardNode) => void = () => {};
  export let onNodeContextMenu: (node: DashboardNode, event: MouseEvent) => void = () => {};
  
  let svgElement: SVGSVGElement;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };
  let panStart = { x: 0, y: 0 };
  
  $: nodes = $dashboardStructure?.nodes || {};
  $: rootId = $dashboardStructure?.rootId || 'main';
  $: zoom = $viewState.zoom;
  $: pan = $viewState.pan;
  $: expandedNodes = $viewState.expandedNodes;
  
  // Calculate node positions for tree layout
  function calculateTreeLayout(nodeId: string, level = 0, index = 0): Array<{ node: DashboardNode; x: number; y: number; level: number }> {
    const node = nodes[nodeId];
    if (!node) return [];
    
    const result: Array<{ node: DashboardNode; x: number; y: number; level: number }> = [];
    const x = index * 250 - (getVisibleChildren(nodeId).length - 1) * 125;
    const y = level * 200;
    
    result.push({ node, x, y, level });
    
    if (expandedNodes.has(nodeId)) {
      const children = getVisibleChildren(nodeId);
      children.forEach((childId, childIndex) => {
        result.push(...calculateTreeLayout(childId, level + 1, childIndex));
      });
    }
    
    return result;
  }
  
  function getVisibleChildren(nodeId: string): string[] {
    const node = nodes[nodeId];
    return node?.children || [];
  }
  
  $: treeLayout = calculateTreeLayout(rootId);
  
  // SVG event handlers
  function handleMouseDown(event: MouseEvent) {
    if (event.target === svgElement) {
      isDragging = true;
      dragStart = { x: event.clientX, y: event.clientY };
      panStart = { ...pan };
      event.preventDefault();
    }
  }
  
  function handleMouseMove(event: MouseEvent) {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setPan({
        x: panStart.x + deltaX / zoom,
        y: panStart.y + deltaY / zoom
      });
    }
  }
  
  function handleMouseUp() {
    isDragging = false;
  }
  
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(zoom * delta);
  }
  
  function handleNodeClick(node: DashboardNode, event: MouseEvent) {
    event.stopPropagation();
    selectNode(node.id);
    onNodeClick(node);
  }
  
  function handleNodeDoubleClick(node: DashboardNode, event: MouseEvent) {
    event.stopPropagation();
    toggleNodeExpansion(node.id);
  }
  
  function handleNodeContextMenu(node: DashboardNode, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    onNodeContextMenu(node, event);
  }
  
  function getNodeColor(type: DashboardNode['type']): string {
    switch (type) {
      case 'main': return '#3b82f6';
      case 'personal': return '#10b981';
      case 'project': return '#8b5cf6';
      case 'team': return '#f59e0b';
      default: return '#6b7280';
    }
  }
  
  function drawConnection(parent: { x: number; y: number }, child: { x: number; y: number }): string {
    const midY = parent.y + (child.y - parent.y) / 2;
    return `M ${parent.x} ${parent.y + 30} 
            L ${parent.x} ${midY} 
            L ${child.x} ${midY} 
            L ${child.x} ${child.y - 30}`;
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

<div class="tree-container">
  <svg
    bind:this={svgElement}
    class="tree-svg"
    on:mousedown={handleMouseDown}
    on:wheel={handleWheel}
  >
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
              refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
      </marker>
    </defs>
    
    <g transform="translate({pan.x}, {pan.y}) scale({zoom})">
      <!-- Connections -->
      {#each treeLayout as { node, x, y }}
        {#if expandedNodes.has(node.id)}
          {#each getVisibleChildren(node.id) as childId}
            {@const childLayout = treeLayout.find(l => l.node.id === childId)}
            {#if childLayout}
              <path
                d={drawConnection({ x, y }, { x: childLayout.x, y: childLayout.y })}
                stroke="#64748b"
                stroke-width="2"
                fill="none"
                marker-end="url(#arrowhead)"
                class="connection-line"
              />
            {/if}
          {/each}
        {/if}
      {/each}
      
      <!-- Nodes -->
      {#each treeLayout as { node, x, y, level }}
        <g 
          class="tree-node"
          class:selected={$viewState.selectedNodeId === node.id}
          class:expandable={node.children.length > 0}
          class:expanded={expandedNodes.has(node.id)}
          transform="translate({x}, {y})"
          on:click={(e) => handleNodeClick(node, e)}
          on:dblclick={(e) => handleNodeDoubleClick(node, e)}
          on:contextmenu={(e) => handleNodeContextMenu(node, e)}
        >
          <!-- Node background -->
          <rect
            x="-80"
            y="-30"
            width="160"
            height="60"
            rx="12"
            fill={node.color}
            stroke={$viewState.selectedNodeId === node.id ? '#ffffff' : 'transparent'}
            stroke-width="3"
            class="node-bg"
          />
          
          <!-- Node icon -->
          <text
            x="-50"
            y="-5"
            text-anchor="middle"
            class="node-icon"
            font-size="20"
          >
            {node.icon}
          </text>
          
          <!-- Node title -->
          <text
            x="0"
            y="-5"
            text-anchor="middle"
            fill="white"
            font-size="12"
            font-weight="600"
            class="node-title"
          >
            {node.name}
          </text>
          
          <!-- Node type -->
          <text
            x="0"
            y="10"
            text-anchor="middle"
            fill="rgba(255, 255, 255, 0.8)"
            font-size="10"
            class="node-type"
          >
            {node.type.toUpperCase()}
          </text>
          
          <!-- Expand/Collapse indicator -->
          {#if node.children.length > 0}
            <circle
              cx="65"
              cy="0"
              r="12"
              fill="rgba(255, 255, 255, 0.2)"
              stroke="white"
              stroke-width="2"
              class="expand-indicator"
            />
            <text
              x="65"
              y="4"
              text-anchor="middle"
              fill="white"
              font-size="12"
              font-weight="bold"
              class="expand-icon"
            >
              {expandedNodes.has(node.id) ? '−' : '+'}
            </text>
          {/if}
          
          <!-- Children count -->
          {#if node.children.length > 0}
            <text
              x="65"
              y="-20"
              text-anchor="middle"
              fill="rgba(255, 255, 255, 0.6)"
              font-size="8"
              class="children-count"
            >
              {node.children.length}
            </text>
          {/if}
        </g>
      {/each}
    </g>
  </svg>
  
  <!-- Zoom controls -->
  <div class="zoom-controls">
    <button class="zoom-btn" on:click={() => setZoom(zoom * 1.2)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <line x1="11" y1="8" x2="11" y2="14"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    </button>
    <span class="zoom-level">{Math.round(zoom * 100)}%</span>
    <button class="zoom-btn" on:click={() => setZoom(zoom * 0.8)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    </button>
    <button class="zoom-btn" on:click={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h18v18H3z"/>
        <path d="M9 9h6v6H9z"/>
      </svg>
    </button>
  </div>
  
  <!-- Minimap -->
  <div class="minimap">
    <svg width="150" height="100" viewBox="-400 -200 800 600">
      {#each treeLayout as { node, x, y }}
        <circle
          cx={x}
          cy={y}
          r="8"
          fill={node.color}
          opacity="0.7"
        />
      {/each}
      <!-- Viewport indicator -->
      <rect
        x={-pan.x / zoom - 75}
        y={-pan.y / zoom - 50}
        width={150 / zoom}
        height={100 / zoom}
        fill="none"
        stroke="#3b82f6"
        stroke-width="2"
      />
    </svg>
  </div>
</div>

<style>
  .tree-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-radius: 12px;
  }
  
  .tree-svg {
    width: 100%;
    height: 100%;
    cursor: grab;
  }
  
  .tree-svg:active {
    cursor: grabbing;
  }
  
  .tree-node {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .tree-node:hover .node-bg {
    filter: brightness(1.1);
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 2;
  }
  
  .tree-node.selected .node-bg {
    filter: brightness(1.2);
    stroke: #ffffff;
    stroke-width: 3;
  }
  
  .node-bg {
    transition: all 0.2s ease;
  }
  
  .node-title {
    pointer-events: none;
    user-select: none;
  }
  
  .node-type {
    pointer-events: none;
    user-select: none;
  }
  
  .node-icon {
    pointer-events: none;
    user-select: none;
  }
  
  .expand-indicator {
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .expand-indicator:hover {
    fill: rgba(255, 255, 255, 0.3);
  }
  
  .expand-icon {
    pointer-events: none;
    user-select: none;
  }
  
  .children-count {
    pointer-events: none;
    user-select: none;
  }
  
  .connection-line {
    transition: all 0.2s ease;
  }
  
  .zoom-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 8px 12px;
  }
  
  .zoom-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .zoom-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .zoom-level {
    color: white;
    font-size: 12px;
    font-weight: 500;
    min-width: 40px;
    text-align: center;
  }
  
  .minimap {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    padding: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .minimap svg {
    display: block;
  }
</style>