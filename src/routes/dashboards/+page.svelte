<script lang="ts">
  import { onMount } from 'svelte';
  import { 
    dashboardStructure, 
    viewState, 
    selectedNode,
    loadDashboards, 
    createDashboard, 
    updateDashboard, 
    deleteDashboard,
    setCurrentView,
    selectNode
  } from '$lib/stores/dashboards';
  import DashboardTree from '$lib/components/DashboardTree.svelte';
  import DashboardList from '$lib/components/DashboardList.svelte';
  import DashboardEditor from '$lib/components/DashboardEditor.svelte';
  import Breadcrumb from '$lib/components/Breadcrumb.svelte';
  import type { DashboardNode } from '$lib/types/dashboard';
  
  let showEditor = false;
  let editingNode: DashboardNode | null = null;
  let showContextMenu = false;
  let contextMenuPosition = { x: 0, y: 0 };
  let contextMenuNode: DashboardNode | null = null;
  let isLoading = true;
  let error = '';
  
  $: currentView = $viewState.currentView;
  $: nodes = $dashboardStructure?.nodes || {};
  $: parentOptions = Object.values(nodes)
    .filter(node => node.type !== 'main')
    .map(node => ({ id: node.id, name: node.name, type: node.type }));
  
  onMount(async () => {
    try {
      await loadDashboards();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load dashboards';
    } finally {
      isLoading = false;
    }
  });
  
  function handleViewSwitch(view: 'tree' | 'list') {
    setCurrentView(view);
  }
  
  function handleNodeClick(node: DashboardNode) {
    console.log('Dashboard clicked:', node.name);
    // Here you could navigate to the actual dashboard
  }
  
  function handleNodeEdit(node: DashboardNode) {
    editingNode = node;
    showEditor = true;
  }
  
  function handleNodeDelete(node: DashboardNode) {
    if (confirm(`Dashboard "${node.name}" wirklich löschen? Alle Unterdashboards werden ebenfalls gelöscht.`)) {
      deleteDashboard(node.id);
    }
  }
  
  function handleNodeContextMenu(node: DashboardNode, event: MouseEvent) {
    contextMenuNode = node;
    contextMenuPosition = { x: event.clientX, y: event.clientY };
    showContextMenu = true;
  }
  
  function handleCreateDashboard() {
    editingNode = null;
    showEditor = true;
  }
  
  async function handleEditorCreate(event: CustomEvent) {
    try {
      await createDashboard(event.detail);
    } catch (err) {
      console.error('Failed to create dashboard:', err);
      alert('Fehler beim Erstellen des Dashboards');
    }
  }
  
  async function handleEditorUpdate(event: CustomEvent) {
    try {
      await updateDashboard(event.detail.id, event.detail.data);
    } catch (err) {
      console.error('Failed to update dashboard:', err);
      alert('Fehler beim Aktualisieren des Dashboards');
    }
  }
  
  function handleEditorClose() {
    showEditor = false;
    editingNode = null;
  }
  
  function handleContextMenuAction(action: string) {
    if (!contextMenuNode) return;
    
    switch (action) {
      case 'edit':
        handleNodeEdit(contextMenuNode);
        break;
      case 'delete':
        handleNodeDelete(contextMenuNode);
        break;
      case 'duplicate':
        // TODO: Implement duplicate functionality
        console.log('Duplicate dashboard:', contextMenuNode.name);
        break;
    }
    
    showContextMenu = false;
    contextMenuNode = null;
  }
  
  function handleClickOutside() {
    showContextMenu = false;
    contextMenuNode = null;
  }
</script>

<svelte:head>
  <title>Dashboard-Struktur - WebSuite IO</title>
</svelte:head>

<svelte:window on:click={handleClickOutside} />

<div class="dashboard-page">
  <div class="page-header">
    <div class="header-content">
      <div class="header-info">
        <h1 class="page-title">
          <span class="title-icon">🏗️</span>
          Dashboard-Struktur
        </h1>
        <p class="page-description">
          Verwalten Sie Ihre Dashboard-Hierarchie und organisieren Sie Ihre Arbeitsbereiche
        </p>
      </div>
      
      <div class="header-actions">
        <div class="view-switcher">
          <button 
            class="view-btn"
            class:active={currentView === 'tree'}
            on:click={() => handleViewSwitch('tree')}
            title="Baumansicht"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
            <span>Baum</span>
          </button>
          <button 
            class="view-btn"
            class:active={currentView === 'list'}
            on:click={() => handleViewSwitch('list')}
            title="Listenansicht"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="7" height="7" x="3" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="14" rx="1"/>
              <rect width="7" height="7" x="3" y="14" rx="1"/>
            </svg>
            <span>Liste</span>
          </button>
        </div>
        
        <button class="create-btn" on:click={handleCreateDashboard}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Neues Dashboard</span>
        </button>
      </div>
    </div>
    
    <Breadcrumb />
  </div>
  
  <div class="page-content">
    {#if isLoading}
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Dashboard-Struktur wird geladen...</p>
      </div>
    {:else if error}
      <div class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Fehler beim Laden</h3>
        <p>{error}</p>
        <button class="retry-btn" on:click={() => window.location.reload()}>
          Erneut versuchen
        </button>
      </div>
    {:else if currentView === 'tree'}
      <DashboardTree 
        {onNodeClick}
        onNodeContextMenu={handleNodeContextMenu}
      />
    {:else if currentView === 'list'}
      <DashboardList 
        onNodeClick={handleNodeClick}
        onNodeEdit={handleNodeEdit}
        onNodeDelete={handleNodeDelete}
      />
    {/if}
  </div>
  
  <!-- Selected Node Info -->
  {#if $selectedNode}
    <div class="node-info-panel">
      <div class="panel-header">
        <div class="panel-title">
          <span class="panel-icon" style="color: {$selectedNode.color}">
            {$selectedNode.icon}
          </span>
          <span>{$selectedNode.name}</span>
        </div>
        <button class="panel-close" on:click={() => selectNode(undefined)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      
      <div class="panel-content">
        <div class="info-item">
          <label>Typ:</label>
          <span class="type-badge" style="background-color: {$selectedNode.color}">
            {$selectedNode.type.toUpperCase()}
          </span>
        </div>
        
        {#if $selectedNode.description}
          <div class="info-item">
            <label>Beschreibung:</label>
            <span>{$selectedNode.description}</span>
          </div>
        {/if}
        
        <div class="info-item">
          <label>Unterdashboards:</label>
          <span>{$selectedNode.children.length}</span>
        </div>
        
        <div class="info-item">
          <label>Erstellt:</label>
          <span>{new Date($selectedNode.metadata.createdAt).toLocaleDateString('de-DE')}</span>
        </div>
        
        {#if $selectedNode.metadata.tags.length > 0}
          <div class="info-item">
            <label>Tags:</label>
            <div class="tags">
              {#each $selectedNode.metadata.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="panel-actions">
          <button class="panel-btn edit-btn" on:click={() => handleNodeEdit($selectedNode)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Bearbeiten
          </button>
          
          {#if $selectedNode.type !== 'main'}
            <button class="panel-btn delete-btn" on:click={() => handleNodeDelete($selectedNode)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              </svg>
              Löschen
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Context Menu -->
  {#if showContextMenu && contextMenuNode}
    <div 
      class="context-menu"
      style="left: {contextMenuPosition.x}px; top: {contextMenuPosition.y}px;"
    >
      <button class="context-item" on:click={() => handleContextMenuAction('edit')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        Bearbeiten
      </button>
      
      <button class="context-item" on:click={() => handleContextMenuAction('duplicate')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        Duplizieren
      </button>
      
      {#if contextMenuNode.type !== 'main'}
        <div class="context-divider"></div>
        <button class="context-item danger" on:click={() => handleContextMenuAction('delete')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
          </svg>
          Löschen
        </button>
      {/if}
    </div>
  {/if}
</div>

<!-- Dashboard Editor Modal -->
<DashboardEditor
  bind:isOpen={showEditor}
  node={editingNode}
  {parentOptions}
  on:create={handleEditorCreate}
  on:update={handleEditorUpdate}
  on:close={handleEditorClose}
/>

<style>
  .dashboard-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
  }
  
  .page-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
    flex-shrink: 0;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 20px;
  }
  
  .header-info {
    flex: 1;
  }
  
  .page-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.025em;
  }
  
  .title-icon {
    font-size: 24px;
  }
  
  .page-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 16px;
    line-height: 1.5;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .view-switcher {
    display: flex;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px;
    gap: 2px;
  }
  
  .view-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .view-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .view-btn.active {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .create-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }
  
  .page-content {
    flex: 1;
    padding: 24px 32px;
    overflow: hidden;
  }
  
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--text-secondary);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border);
    border-top: 4px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .error-state h3 {
    margin: 0 0 8px 0;
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 600;
  }
  
  .error-state p {
    margin: 0 0 16px 0;
    font-size: 14px;
  }
  
  .retry-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .retry-btn:hover {
    background: var(--accent-hover);
  }
  
  .node-info-panel {
    position: fixed;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    width: 300px;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: slideInRight 300ms ease;
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateY(-50%) translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }
  }
  
  .panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-secondary);
    border-radius: 12px 12px 0 0;
  }
  
  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .panel-icon {
    font-size: 18px;
  }
  
  .panel-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .panel-close:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .panel-content {
    padding: 20px;
  }
  
  .info-item {
    margin-bottom: 16px;
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .info-item label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .info-item span {
    color: var(--text-primary);
    font-size: 14px;
  }
  
  .type-badge {
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .tag {
    background: var(--accent-light);
    color: var(--accent-color);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .panel-actions {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
  }
  
  .panel-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .edit-btn:hover {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border-color: var(--accent-color);
  }
  
  .delete-btn:hover {
    background: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  .context-menu {
    position: fixed;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    min-width: 160px;
    overflow: hidden;
    animation: fadeIn 150ms ease;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .context-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    background: transparent;
    color: var(--text-primary);
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .context-item:hover {
    background: var(--bg-hover);
  }
  
  .context-item.danger {
    color: #ef4444;
  }
  
  .context-item.danger:hover {
    background: #fef2f2;
    color: #dc2626;
  }
  
  .context-divider {
    height: 1px;
    background: var(--border);
    margin: 4px 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .page-header {
      padding: 16px 20px;
    }
    
    .header-content {
      flex-direction: column;
      gap: 16px;
    }
    
    .header-actions {
      width: 100%;
      justify-content: space-between;
    }
    
    .page-content {
      padding: 16px 20px;
    }
    
    .node-info-panel {
      position: fixed;
      top: auto;
      bottom: 0;
      right: 0;
      left: 0;
      width: auto;
      transform: none;
      border-radius: 12px 12px 0 0;
      animation: slideInUp 300ms ease;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
</style>