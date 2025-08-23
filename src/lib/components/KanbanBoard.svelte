<!-- src/lib/components/KanbanBoard.svelte -->
<script>
  import { kanbanBoards, activeBoard, addCard, moveCard, deleteCard, setBoardViewMode } from '$lib/stores/kanban';
  import { startPomodoro } from '$lib/stores/pomodoro';
  import { switchToDesktop } from '$lib/stores/view';
  import { dndzone } from 'svelte-dnd-action';
  import ListView from './ListView.svelte';
  import GanttView from './GanttView.svelte';
  
  let showAddCard = {};
  let newCardTitle = '';
  let newCardDescription = '';
  let newCardPriority = 'medium';
  let newCardAssignee = '';

  $: currentBoard = $kanbanBoards.find(board => board.id === $activeBoard);
  $: viewMode = currentBoard?.viewMode || 'kanban';

  function handleAddCard(columnId) {
    if (newCardTitle.trim()) {
      addCard($activeBoard, columnId, {
        title: newCardTitle.trim(),
        description: newCardDescription.trim(),
        priority: newCardPriority,
        assignee: newCardAssignee.trim()
      });
      newCardTitle = '';
      newCardDescription = '';
      newCardPriority = 'medium';
      newCardAssignee = '';
      showAddCard[columnId] = false;
    }
  }
  
  function switchView(mode) {
    setBoardViewMode($activeBoard, mode);
  }
  
  function startPomodoroWithTask(card) {
    startPomodoro(card);
    switchToDesktop();
  }

  function handleDndConsider(columnId, e) {
    const board = $kanbanBoards.find(b => b.id === $activeBoard);
    if (!board) return;
    
    kanbanBoards.update(boards => 
      boards.map(b => 
        b.id === $activeBoard 
          ? {
              ...b,
              columns: b.columns.map(col => 
                col.id === columnId 
                  ? { ...col, cards: e.detail.items }
                  : col
              )
            }
          : b
      )
    );
  }

  function handleDndFinalize(columnId, e) {
    const board = $kanbanBoards.find(b => b.id === $activeBoard);
    if (!board) return;
    
    kanbanBoards.update(boards => 
      boards.map(b => 
        b.id === $activeBoard 
          ? {
              ...b,
              columns: b.columns.map(col => 
                col.id === columnId 
                  ? { ...col, cards: e.detail.items }
                  : col
              )
            }
          : b
      )
    );
  }

  function getPriorityColor(priority) {
    switch(priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--priority-medium)';
    }
  }

  function getPriorityLabel(priority) {
    switch(priority) {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
      default: return 'Mittel';
    }
  }
</script>

<div class="kanban-container">
  <header class="kanban-header">
    <div class="header-content">
      <div class="board-info">
        <h1 class="board-title">
          <span class="board-icon">📋</span>
          {currentBoard?.title || 'Kanban Board'}
        </h1>
        <p class="board-description">Organisieren Sie Ihre Aufgaben effizient</p>
      </div>
      
      <div class="view-controls">
        <div class="view-switcher">
          <button 
            class="view-btn"
            class:active={viewMode === 'kanban'}
            on:click={() => switchView('kanban')}
          >
            <span class="view-icon">📋</span>
            <span class="view-label">Board</span>
          </button>
          <button 
            class="view-btn"
            class:active={viewMode === 'list'}
            on:click={() => switchView('list')}
          >
            <span class="view-icon">📝</span>
            <span class="view-label">Liste</span>
          </button>
          <button 
            class="view-btn"
            class:active={viewMode === 'gantt'}
            on:click={() => switchView('gantt')}
          >
            <span class="view-icon">📊</span>
            <span class="view-label">Gantt</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  
  {#if currentBoard}
    <main class="board-content">
      {#if viewMode === 'kanban'}
        <div class="kanban-board">
          {#each currentBoard.columns as column (column.id)}
            <section class="kanban-column">
              <header class="column-header">
                <div class="column-info">
                  <h2 class="column-title">{column.title}</h2>
                  <div class="card-count">
                    <span class="count-number">{column.cards.length}</span>
                    <span class="count-label">Tasks</span>
                  </div>
                </div>
                <div class="column-actions">
                  <button 
                    class="add-card-trigger"
                    on:click={() => showAddCard[column.id] = true}
                    aria-label="Neue Karte hinzufügen"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
              </header>
              
              <div 
                class="cards-container"
                use:dndzone={{
                  items: column.cards,
                  flipDurationMs: 200,
                  dropTargetStyle: { outline: '2px dashed var(--accent-color)', outlineOffset: '4px' }
                }}
                on:consider={(e) => handleDndConsider(column.id, e)}
                on:finalize={(e) => handleDndFinalize(column.id, e)}
              >
                {#each column.cards as card (card.id)}
                  <article class="kanban-card" data-id={card.id}>
                    <header class="card-header">
                      <h3 class="card-title">{card.title}</h3>
                      <div class="card-menu">
                        <button 
                          class="card-action pomodoro-action"
                          on:click={() => startPomodoroWithTask(card)}
                          title="Pomodoro Timer starten"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12,6 12,12 16,14"/>
                          </svg>
                        </button>
                        <button 
                          class="card-action delete-action"
                          on:click={() => deleteCard($activeBoard, column.id, card.id)}
                          title="Karte löschen"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                          </svg>
                        </button>
                      </div>
                    </header>
                    
                    {#if card.description}
                      <div class="card-description">
                        <p>{card.description}</p>
                      </div>
                    {/if}
                    
                    <footer class="card-footer">
                      <div class="card-meta">
                        {#if card.priority}
                          <div class="priority-indicator" style="--priority-color: {getPriorityColor(card.priority)}">
                            <span class="priority-dot"></span>
                            <span class="priority-text">{getPriorityLabel(card.priority)}</span>
                          </div>
                        {/if}
                        
                        {#if card.assignee}
                          <div class="assignee-info">
                            <div class="assignee-avatar">
                              {card.assignee.charAt(0).toUpperCase()}
                            </div>
                            <span class="assignee-name">{card.assignee}</span>
                          </div>
                        {/if}
                      </div>
                    </footer>
                  </article>
                {/each}
              </div>
              
              {#if showAddCard[column.id]}
                <div class="add-card-form">
                  <div class="form-header">
                    <h3 class="form-title">Neue Aufgabe</h3>
                    <button 
                      class="form-close"
                      on:click={() => showAddCard[column.id] = false}
                      aria-label="Formular schließen"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="form-content">
                    <div class="form-field">
                      <label for="card-title-{column.id}" class="field-label">Titel</label>
                      <input 
                        id="card-title-{column.id}"
                        bind:value={newCardTitle}
                        placeholder="Aufgabentitel eingeben..."
                        class="field-input"
                        on:keydown={(e) => e.key === 'Enter' && handleAddCard(column.id)}
                      />
                    </div>
                    
                    <div class="form-field">
                      <label for="card-description-{column.id}" class="field-label">Beschreibung</label>
                      <textarea 
                        id="card-description-{column.id}"
                        bind:value={newCardDescription}
                        placeholder="Zusätzliche Details..."
                        class="field-textarea"
                        rows="3"
                      ></textarea>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-field">
                        <label for="card-priority-{column.id}" class="field-label">Priorität</label>
                        <select 
                          id="card-priority-{column.id}"
                          bind:value={newCardPriority}
                          class="field-select"
                        >
                          <option value="low">Niedrig</option>
                          <option value="medium">Mittel</option>
                          <option value="high">Hoch</option>
                        </select>
                      </div>
                      
                      <div class="form-field">
                        <label for="card-assignee-{column.id}" class="field-label">Zugewiesen</label>
                        <input 
                          id="card-assignee-{column.id}"
                          bind:value={newCardAssignee}
                          placeholder="Name eingeben..."
                          class="field-input"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div class="form-actions">
                    <button 
                      class="btn btn-secondary"
                      on:click={() => showAddCard[column.id] = false}
                    >
                      Abbrechen
                    </button>
                    <button 
                      class="btn btn-primary"
                      on:click={() => handleAddCard(column.id)}
                      disabled={!newCardTitle.trim()}
                    >
                      Erstellen
                    </button>
                  </div>
                </div>
              {:else}
                <button 
                  class="add-card-btn"
                  on:click={() => showAddCard[column.id] = true}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  <span>Aufgabe hinzufügen</span>
                </button>
              {/if}
            </section>
          {/each}
        </div>
      {:else if viewMode === 'list'}
        <ListView />
      {:else if viewMode === 'gantt'}
        <GanttView />
      {/if}
    </main>
  {/if}
</div>

<style>
  :root {
    --priority-high: #ef4444;
    --priority-medium: #f59e0b;
    --priority-low: #10b981;
  }

  .kanban-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
  }

  .kanban-header {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    padding: 2rem 2rem 1.5rem;
    flex-shrink: 0;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .board-info {
    flex: 1;
  }

  .board-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  .board-icon {
    font-size: 1.75rem;
  }

  .board-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 1rem;
    line-height: 1.5;
  }

  .view-controls {
    flex-shrink: 0;
  }

  .view-switcher {
    display: flex;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 0.25rem;
    gap: 0.125rem;
  }

  .view-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .view-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .view-btn.active {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .view-icon {
    font-size: 1rem;
  }

  .view-label {
    font-size: 0.875rem;
  }

  .board-content {
    flex: 1;
    overflow: hidden;
    padding: 0 2rem 2rem;
  }

  .kanban-board {
    display: flex;
    gap: 1.5rem;
    height: 100%;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .kanban-column {
    min-width: 320px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 1rem;
    overflow: hidden;
  }

  .column-header {
    padding: 1.5rem 1.5rem 1rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .column-info {
    flex: 1;
  }

  .column-title {
    margin: 0 0 0.75rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .card-count {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .count-number {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-color);
    line-height: 1;
  }

  .count-label {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .column-actions {
    flex-shrink: 0;
  }

  .add-card-trigger {
    background: var(--bg-hover);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-card-trigger:hover {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border-color: var(--accent-color);
    transform: scale(1.05);
  }

  .cards-container {
    flex: 1;
    padding: 1rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    min-height: 200px;
  }

  .kanban-card {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.25rem;
    cursor: grab;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  }

  .kanban-card:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    transform: translateY(-1px);
    border-color: var(--accent-color);
  }

  .kanban-card:active {
    cursor: grabbing;
    transform: rotate(2deg) scale(1.02);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .card-title {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
    flex: 1;
  }

  .card-menu {
    display: flex;
    gap: 0.375rem;
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .kanban-card:hover .card-menu {
    opacity: 1;
  }

  .card-action {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    padding: 0.375rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pomodoro-action:hover {
    background: #fef3c7;
    color: #d97706;
    border-color: #fbbf24;
  }

  .delete-action:hover {
    background: #fef2f2;
    color: #dc2626;
    border-color: #fca5a5;
  }

  .card-description {
    margin-bottom: 1rem;
  }

  .card-description p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .card-footer {
    margin-top: auto;
  }

  .card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .priority-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .priority-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--priority-color);
  }

  .priority-text {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .assignee-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .assignee-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent-color);
    color: var(--accent-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .assignee-name {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .add-card-form {
    margin: 0 1.5rem 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  .form-header {
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .form-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    padding: 0.25rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 150ms ease;
  }

  .form-close:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .form-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .field-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .field-input,
  .field-textarea,
  .field-select {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: all 150ms ease;
    font-family: inherit;
  }

  .field-input:focus,
  .field-textarea:focus,
  .field-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  .field-textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }

  .btn {
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 150ms ease;
    border: 1px solid transparent;
  }

  .btn-secondary {
    background: var(--bg-primary);
    color: var(--text-secondary);
    border-color: var(--border);
  }

  .btn-secondary:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  .btn-primary {
    background: var(--accent-color);
    color: var(--accent-foreground);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-hover);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .add-card-btn {
    margin: 0 1.5rem 1.5rem;
    background: var(--bg-primary);
    border: 2px dashed var(--border);
    color: var(--text-secondary);
    padding: 1rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .add-card-btn:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .kanban-header {
      padding: 1.5rem 1rem 1rem;
    }

    .header-content {
      flex-direction: column;
      gap: 1.5rem;
    }

    .board-content {
      padding: 0 1rem 1rem;
    }

    .kanban-board {
      gap: 1rem;
    }

    .kanban-column {
      min-width: 280px;
      max-width: 280px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>