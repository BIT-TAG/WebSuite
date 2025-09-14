<script lang="ts">
  import { dashboardStructure, searchQuery, filteredNodes, selectNode } from '$lib/stores/dashboards';
  import type { DashboardNode } from '$lib/types/dashboard';
  
  export let onNodeClick: (node: DashboardNode) => void = () => {};
  export let onNodeEdit: (node: DashboardNode) => void = () => {};
  export let onNodeDelete: (node: DashboardNode) => void = () => {};
  
  $: nodes = $searchQuery ? $filteredNodes : ($dashboardStructure?.nodes || {});
  $: nodesList = Object.values(nodes).sort((a, b) => {
    // Sort by type first, then by name
    const typeOrder = { main: 0, personal: 1, project: 2, team: 3 };
    const aOrder = typeOrder[a.type] ?? 4;
    const bOrder = typeOrder[b.type] ?? 4;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name);
  });
  
  function getTypeIcon(type: DashboardNode['type']): string {
    switch (type) {
      case 'main': return '🏠';
      case 'personal': return '👤';
      case 'project': return '📁';
      case 'team': return '👥';
      default: return '📄';
    }
  }
  
  function getTypeLabel(type: DashboardNode['type']): string {
    switch (type) {
      case 'main': return 'Hauptdashboard';
      case 'personal': return 'Persönlich';
      case 'project': return 'Projekt';
      case 'team': return 'Team';
      default: return 'Unbekannt';
    }
  }
  
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function handleNodeClick(node: DashboardNode) {
    selectNode(node.id);
    onNodeClick(node);
  }
</script>

<div class="list-container">
  <!-- Search bar -->
  <div class="search-bar">
    <div class="search-input-container">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        type="text"
        placeholder="Dashboards durchsuchen..."
        bind:value={$searchQuery}
        class="search-input"
      />
      {#if $searchQuery}
        <button class="clear-search" on:click={() => searchQuery.set('')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      {/if}
    </div>
  </div>
  
  <!-- Results info -->
  {#if $searchQuery}
    <div class="search-results">
      {Object.keys(nodes).length} Ergebnisse für "{$searchQuery}"
    </div>
  {/if}
  
  <!-- Dashboard list -->
  <div class="dashboard-list">
    {#each nodesList as node (node.id)}
      <div 
        class="dashboard-card"
        class:main={node.type === 'main'}
        on:click={() => handleNodeClick(node)}
      >
        <div class="card-header">
          <div class="card-icon" style="background-color: {node.color}">
            {node.icon}
          </div>
          <div class="card-info">
            <h3 class="card-title">{node.name}</h3>
            <div class="card-meta">
              <span class="card-type">{getTypeLabel(node.type)}</span>
              {#if node.children.length > 0}
                <span class="card-children">{node.children.length} Unterdashboards</span>
              {/if}
            </div>
          </div>
          <div class="card-actions">
            <button 
              class="action-btn edit-btn"
              on:click|stopPropagation={() => onNodeEdit(node)}
              title="Bearbeiten"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            {#if node.type !== 'main'}
              <button 
                class="action-btn delete-btn"
                on:click|stopPropagation={() => onNodeDelete(node)}
                title="Löschen"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                </svg>
              </button>
            {/if}
          </div>
        </div>
        
        {#if node.description}
          <div class="card-description">
            {node.description}
          </div>
        {/if}
        
        <div class="card-footer">
          <div class="card-tags">
            {#each node.metadata.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
          <div class="card-date">
            Aktualisiert: {formatDate(node.metadata.updatedAt)}
          </div>
        </div>
      </div>
    {/each}
    
    {#if nodesList.length === 0}
      <div class="empty-state">
        {#if $searchQuery}
          <div class="empty-icon">🔍</div>
          <h3>Keine Ergebnisse gefunden</h3>
          <p>Versuchen Sie andere Suchbegriffe oder erstellen Sie ein neues Dashboard.</p>
        {:else}
          <div class="empty-icon">📊</div>
          <h3>Keine Dashboards vorhanden</h3>
          <p>Erstellen Sie Ihr erstes Dashboard, um loszulegen.</p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    border-radius: 12px;
    overflow: hidden;
  }
  
  .search-bar {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
  }
  
  .search-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--text-muted);
    z-index: 1;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .clear-search {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .clear-search:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  .search-results {
    padding: 12px 20px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border);
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .dashboard-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .dashboard-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .dashboard-card:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .dashboard-card.main {
    border-color: var(--accent-color);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(59, 130, 246, 0.05) 100%);
  }
  
  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 12px;
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: white;
    flex-shrink: 0;
  }
  
  .card-info {
    flex: 1;
    min-width: 0;
  }
  
  .card-title {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }
  
  .card-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--text-secondary);
  }
  
  .card-type {
    background: var(--bg-tertiary);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .card-children {
    font-size: 12px;
  }
  
  .card-actions {
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .dashboard-card:hover .card-actions {
    opacity: 1;
  }
  
  .action-btn {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
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
  
  .card-description {
    margin-bottom: 16px;
    color: var(--text-secondary);
    font-size: 14px;
    line-height: 1.5;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  
  .card-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  
  .tag {
    background: var(--accent-light);
    color: var(--accent-color);
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }
  
  .card-date {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
  }
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .empty-state h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .empty-state p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    max-width: 400px;
  }
</style>