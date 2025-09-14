<script lang="ts">
  import { breadcrumbPath, selectNode } from '$lib/stores/dashboards';
  import type { BreadcrumbItem } from '$lib/types/dashboard';
  
  export let onNavigate: (item: BreadcrumbItem) => void = () => {};
  
  function handleItemClick(item: BreadcrumbItem) {
    selectNode(item.id);
    onNavigate(item);
  }
  
  function getTypeIcon(type: string): string {
    switch (type) {
      case 'main': return '🏠';
      case 'personal': return '👤';
      case 'project': return '📁';
      case 'team': return '👥';
      default: return '📄';
    }
  }
</script>

{#if $breadcrumbPath.length > 0}
  <nav class="breadcrumb" aria-label="Breadcrumb Navigation">
    <ol class="breadcrumb-list">
      {#each $breadcrumbPath as item, index}
        <li class="breadcrumb-item">
          {#if index < $breadcrumbPath.length - 1}
            <button 
              class="breadcrumb-link"
              on:click={() => handleItemClick(item)}
              title="Zu {item.name} navigieren"
            >
              <span class="breadcrumb-icon">{getTypeIcon(item.type)}</span>
              <span class="breadcrumb-text">{item.name}</span>
            </button>
          {:else}
            <span class="breadcrumb-current">
              <span class="breadcrumb-icon">{getTypeIcon(item.type)}</span>
              <span class="breadcrumb-text">{item.name}</span>
            </span>
          {/if}
          
          {#if index < $breadcrumbPath.length - 1}
            <svg class="breadcrumb-separator" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}

<style>
  .breadcrumb {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 20px;
  }
  
  .breadcrumb-list {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
    flex-wrap: wrap;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
  }
  
  .breadcrumb-link:hover {
    background: var(--bg-hover);
    color: var(--accent-color);
  }
  
  .breadcrumb-current {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
  }
  
  .breadcrumb-icon {
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .breadcrumb-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  
  .breadcrumb-separator {
    color: var(--text-muted);
    flex-shrink: 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .breadcrumb {
      padding: 8px 12px;
    }
    
    .breadcrumb-text {
      max-width: 100px;
    }
    
    .breadcrumb-list {
      gap: 4px;
    }
  }
</style>