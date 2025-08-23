<!-- src/lib/components/ListView.svelte -->
<script>
  import { kanbanBoards, activeBoard, deleteCard } from '$lib/stores/kanban';
  import { startPomodoro } from '$lib/stores/pomodoro';
  import { switchToDesktop } from '$lib/stores/view';
  
  $: currentBoard = $kanbanBoards.find(board => board.id === $activeBoard);
  $: allCards = currentBoard ? currentBoard.columns.flatMap(col => col.cards) : [];
  
  // Gruppiere Karten nach Status
  $: groupedCards = currentBoard ? currentBoard.columns.reduce((acc, col) => {
    acc[col.title] = col.cards;
    return acc;
  }, {}) : {};
  
  let expandedGroups = {};
  
  function toggleGroup(groupName) {
    expandedGroups[groupName] = !expandedGroups[groupName];
    expandedGroups = { ...expandedGroups };
  }
  
  function getPriorityColor(priority) {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  }
  
  function getPriorityLabel(priority) {
    switch(priority) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Keine';
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  }
  
  function startPomodoroWithTask(card) {
    startPomodoro(card);
    switchToDesktop();
  }
  
  function getColumnIdByTitle(title) {
    const column = currentBoard?.columns.find(col => col.title === title);
    return column?.id;
  }
  
  // Initialisiere alle Gruppen als erweitert
  $: if (currentBoard) {
    currentBoard.columns.forEach(col => {
      if (expandedGroups[col.title] === undefined) {
        expandedGroups[col.title] = true;
      }
    });
  }
</script>

<div class="list-view">
  <div class="list-header">
    <div class="header-row">
      <div class="header-cell task-col">Task</div>
      <div class="header-cell status-col">Status</div>
      <div class="header-cell priority-col">Priorität</div>
      <div class="header-cell assignee-col">Zugewiesen</div>
      <div class="header-cell date-col">Start</div>
      <div class="header-cell date-col">Fällig</div>
      <div class="header-cell actions-col">Aktionen</div>
    </div>
  </div>
  
  <div class="list-content">
    {#each Object.entries(groupedCards) as [groupName, cards]}
      <div class="group">
        <div class="group-header" on:click={() => toggleGroup(groupName)}>
          <div class="group-toggle">
            {expandedGroups[groupName] ? '▼' : '▶'}
          </div>
          <div class="group-title">{groupName}</div>
          <div class="group-count">{cards.length}</div>
        </div>
        
        {#if expandedGroups[groupName]}
          <div class="group-content">
            {#each cards as card}
              <div class="list-row">
                <div class="list-cell task-col">
                  <div class="task-info">
                    <div class="task-title">{card.title}</div>
                    {#if card.description}
                      <div class="task-description">{card.description}</div>
                    {/if}
                    {#if card.tags && card.tags.length > 0}
                      <div class="task-tags">
                        {#each card.tags as tag}
                          <span class="tag">{tag}</span>
                        {/each}
                      </div>
                    {/if}
                  </div>
                </div>
                
                <div class="list-cell status-col">
                  <span class="status-badge" style="background-color: var(--accent-color)">
                    {card.status}
                  </span>
                </div>
                
                <div class="list-cell priority-col">
                  <span 
                    class="priority-badge" 
                    style="background-color: {getPriorityColor(card.priority)}"
                  >
                    {getPriorityLabel(card.priority)}
                  </span>
                </div>
                
                <div class="list-cell assignee-col">
                  <div class="assignee">
                    {#if card.assignee}
                      <div class="assignee-avatar">
                        {card.assignee.charAt(0).toUpperCase()}
                      </div>
                      <span class="assignee-name">{card.assignee}</span>
                    {:else}
                      <span class="no-assignee">Nicht zugewiesen</span>
                    {/if}
                  </div>
                </div>
                
                <div class="list-cell date-col">
                  {formatDate(card.startDate)}
                </div>
                
                <div class="list-cell date-col">
                  <span class="due-date" class:overdue={card.dueDate && new Date(card.dueDate) < new Date()}>
                    {formatDate(card.dueDate)}
                  </span>
                </div>
                
                <div class="list-cell actions-col">
                  <div class="action-buttons">
                    <button 
                      class="action-btn pomodoro-btn"
                      on:click={() => startPomodoroWithTask(card)}
                      title="Pomodoro starten"
                    >
                      🍅
                    </button>
                    <button 
                      class="action-btn delete-btn"
                      on:click={() => deleteCard($activeBoard, getColumnIdByTitle(groupName), card.id)}
                      title="Löschen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .list-view {
    height: 100%;
    background: var(--bg-primary);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border-light);
  }
  
  .list-header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .header-row {
    display: grid;
    grid-template-columns: 2fr 120px 100px 150px 100px 100px 100px;
    gap: 1rem;
    padding: 1rem 1.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .header-cell {
    display: flex;
    align-items: center;
  }
  
  .list-content {
    overflow-y: auto;
    height: calc(100% - 60px);
  }
  
  .group {
    border-bottom: 1px solid var(--border-light);
  }
  
  .group:last-child {
    border-bottom: none;
  }
  
  .group-header {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--bg-tertiary);
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .group-header:hover {
    background: var(--bg-hover);
  }
  
  .group-toggle {
    margin-right: 0.75rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    transition: transform 0.2s ease;
  }
  
  .group-title {
    flex: 1;
    font-size: 0.875rem;
  }
  
  .group-count {
    background: var(--accent-color);
    color: white;
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .group-content {
    background: var(--bg-primary);
  }
  
  .list-row {
    display: grid;
    grid-template-columns: 2fr 120px 100px 150px 100px 100px 100px;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-light);
    transition: background-color 0.2s ease;
  }
  
  .list-row:hover {
    background: var(--bg-hover);
  }
  
  .list-row:last-child {
    border-bottom: none;
  }
  
  .list-cell {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
  }
  
  .task-info {
    width: 100%;
  }
  
  .task-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }
  
  .task-description {
    color: var(--text-secondary);
    font-size: 0.8125rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }
  
  .task-tags {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }
  
  .tag {
    background: var(--accent-light);
    color: var(--accent-color);
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-badge, .priority-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    text-align: center;
  }
  
  .assignee {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .assignee-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .assignee-name {
    color: var(--text-primary);
    font-size: 0.8125rem;
  }
  
  .no-assignee {
    color: var(--text-secondary);
    font-style: italic;
    font-size: 0.8125rem;
  }
  
  .due-date.overdue {
    color: #ef4444;
    font-weight: 500;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .pomodoro-btn {
    background: #fef3c7;
    color: #d97706;
  }
  
  .pomodoro-btn:hover {
    background: #fde68a;
    transform: scale(1.05);
  }
  
  .delete-btn {
    background: #fef2f2;
    color: #dc2626;
  }
  
  .delete-btn:hover {
    background: #fecaca;
    transform: scale(1.05);
  }
</style>