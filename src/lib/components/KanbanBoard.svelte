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

  $: currentBoard = $kanbanBoards.find(board => board.id === $activeBoard);
  $: viewMode = currentBoard?.viewMode || 'kanban';

  function handleAddCard(columnId) {
    if (newCardTitle.trim()) {
      addCard($activeBoard, columnId, {
        title: newCardTitle.trim(),
        description: newCardDescription.trim()
      });
      newCardTitle = '';
      newCardDescription = '';
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
</script>

<div class="kanban-container">
  <div class="kanban-header">
    <h2>📋 {currentBoard?.title || 'Kanban Board'}</h2>
    <div class="view-switcher">
      <button 
        class="view-btn"
        class:active={viewMode === 'kanban'}
        on:click={() => switchView('kanban')}
      >
        📋 Kanban
      </button>
      <button 
        class="view-btn"
        class:active={viewMode === 'list'}
        on:click={() => switchView('list')}
      >
        📝 Liste
      </button>
      <button 
        class="view-btn"
        class:active={viewMode === 'gantt'}
        on:click={() => switchView('gantt')}
      >
        📊 Gantt
      </button>
    </div>
  </div>
  
  {#if currentBoard}
    <div class="board-content">
      {#if viewMode === 'kanban'}
        <div class="kanban-board">
          {#each currentBoard.columns as column (column.id)}
            <div class="kanban-column">
              <div class="column-header">
                <h3>{column.title}</h3>
                <span class="card-count">{column.cards.length}</span>
              </div>
              
              <div 
                class="cards-container"
                use:dndzone={{
                  items: column.cards,
                  flipDurationMs: 300,
                  dropTargetStyle: {}
                }}
                on:consider={(e) => handleDndConsider(column.id, e)}
                on:finalize={(e) => handleDndFinalize(column.id, e)}
              >
                {#each column.cards as card (card.id)}
                  <div class="kanban-card" data-id={card.id}>
                    <div class="card-header">
                      <h4>{card.title}</h4>
                      <div class="card-actions">
                        <button 
                          class="pomodoro-btn"
                          on:click={() => startPomodoroWithTask(card)}
                          aria-label="Pomodoro starten"
                          title="Pomodoro Timer für diese Task starten"
                        >
                          🍅
                        </button>
                        <button 
                          class="delete-btn"
                          on:click={() => deleteCard($activeBoard, column.id, card.id)}
                          aria-label="Karte löschen"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                    {#if card.description}
                      <p class="card-description">{card.description}</p>
                    {/if}
                    {#if card.priority}
                      <div class="card-meta">
                        <span class="priority-badge priority-{card.priority}">
                          {card.priority === 'high' ? 'Hoch' : card.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                        </span>
                        {#if card.assignee}
                          <span class="assignee-badge">👤 {card.assignee}</span>
                        {/if}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
              
              {#if showAddCard[column.id]}
                <div class="add-card-form">
                  <input 
                    bind:value={newCardTitle}
                    placeholder="Titel der Karte..."
                    class="card-input"
                    on:keydown={(e) => e.key === 'Enter' && handleAddCard(column.id)}
                  />
                  <textarea 
                    bind:value={newCardDescription}
                    placeholder="Beschreibung (optional)..."
                    class="card-textarea"
                    rows="2"
                  ></textarea>
                  <div class="form-buttons">
                    <button on:click={() => handleAddCard(column.id)} class="save-btn">
                      Speichern
                    </button>
                    <button on:click={() => showAddCard[column.id] = false} class="cancel-btn">
                      Abbrechen
                    </button>
                  </div>
                </div>
              {:else}
                <button 
                  class="add-card-btn"
                  on:click={() => showAddCard[column.id] = true}
                >
                  + Karte hinzufügen
                </button>
              {/if}
            </div>
          {/each}
        </div>
      {:else if viewMode === 'list'}
        <ListView />
      {:else if viewMode === 'gantt'}
        <GanttView />
      {/if}
    </div>
  {/if}
</div>

<style>
  .kanban-container {
    height: 100%;
    padding: 2rem;
    background: var(--bg-secondary);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .kanban-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .kanban-header h2 {
    color: var(--text-primary);
    margin: 0;
    font-size: 1.875rem;
    font-weight: 400;
    letter-spacing: -0.025em;
  }
  
  .view-switcher {
    display: flex;
    gap: 0.25rem;
    background: var(--bg-tertiary);
    border-radius: 12px;
    padding: 0.375rem;
  }
  
  .view-btn {
    background: transparent;
    color: var(--text-secondary);
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 0.875rem;
    font-weight: 400;
    white-space: nowrap;
  }
  
  .view-btn:hover {
    background: rgba(255, 255, 255, 0.7);
    color: var(--text-primary);
  }
  
  .view-btn.active {
    background: var(--bg-primary);
    color: var(--text-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-weight: 500;
  }
  
  .board-content {
    flex: 1;
    overflow: hidden;
  }

  .kanban-board {
    display: flex;
    gap: 1.25rem;
    height: 100%;
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .kanban-column {
    min-width: 320px;
    background: var(--bg-primary);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-light);
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-light);
  }

  .column-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 500;
  }

  .card-count {
    background: var(--accent-color);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .cards-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow-y: auto;
    margin-bottom: 1.5rem;
  }

  .kanban-card {
    background: var(--bg-primary);
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-light);
    cursor: grab;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .kanban-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: var(--border-medium);
  }

  .kanban-card:active {
    cursor: grabbing;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .card-header h4 {
    margin: 0;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    flex: 1;
    line-height: 1.4;
  }

  .card-actions {
    display: flex;
    gap: 0.375rem;
  }
  
  .pomodoro-btn {
    background: #fef3c7;
    border: none;
    color: #d97706;
    padding: 0.375rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s ease;
  }
  
  .pomodoro-btn:hover {
    background: #fde68a;
    transform: scale(1.05);
  }
  
  .delete-btn {
    background: #fef2f2;
    border: none;
    color: #dc2626;
    padding: 0.375rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s ease;
  }

  .delete-btn:hover {
    background: #fecaca;
  }

  .card-description {
    margin: 0 0 0.75rem 0;
    color: var(--text-secondary);
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  
  .card-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .priority-badge {
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }
  
  .priority-high {
    background: #ef4444;
  }
  
  .priority-medium {
    background: #f59e0b;
  }
  
  .priority-low {
    background: #10b981;
  }
  
  .assignee-badge {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.75rem;
  }

  .add-card-form {
    background: var(--bg-hover);
    border-radius: 12px;
    padding: 1.25rem;
    border: 2px dashed var(--border-medium);
  }

  .card-input, .card-textarea {
    width: 100%;
    border: 1px solid var(--border-light);
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    font-family: inherit;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  .card-input:focus, .card-textarea:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px var(--accent-light);
  }

  .form-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .save-btn, .cancel-btn {
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .save-btn {
    background: #10b981;
    color: white;
  }

  .save-btn:hover {
    background: #059669;
  }

  .cancel-btn {
    background: #ef4444;
    color: white;
  }

  .cancel-btn:hover {
    background: #dc2626;
  }

  .add-card-btn {
    width: 100%;
    padding: 1rem;
    background: var(--bg-hover);
    border: 2px dashed var(--accent-color);
    border-radius: 12px;
    color: var(--accent-color);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .add-card-btn:hover {
    background: var(--accent-light);
    border-style: solid;
  }
</style>