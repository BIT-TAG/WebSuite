<!-- src/lib/components/KanbanBoard.svelte -->
<script>
  import { kanbanBoards, activeBoard, addCard, moveCard, deleteCard } from '$lib/stores/kanban';
  import { startPomodoro } from '$lib/stores/pomodoro';
  import { switchToDesktop } from '$lib/stores/view';
  import { dndzone } from 'svelte-dnd-action';
  
  let showAddCard = {};
  let newCardTitle = '';
  let newCardDescription = '';

  $: currentBoard = $kanbanBoards.find(board => board.id === $activeBoard);

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
  </div>
  
  {#if currentBoard}
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
  {/if}
</div>

<style>
  .kanban-container {
    height: 100%;
    padding: 3rem 2rem;
    background: #fafafa;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .kanban-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .kanban-header h2 {
    color: #0f172a;
    margin: 0;
    font-size: 2.25rem;
    font-weight: 300;
    letter-spacing: -0.025em;
  }

  .kanban-board {
    display: flex;
    gap: 1.25rem;
    height: calc(100% - 8rem);
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .kanban-column {
    min-width: 320px;
    background: white;
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .column-header h3 {
    margin: 0;
    color: #1e293b;
    font-size: 1.125rem;
    font-weight: 500;
  }

  .card-count {
    background: #3b82f6;
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
    background: white;
    border-radius: 12px;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    cursor: grab;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .kanban-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #e2e8f0;
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
    color: #1e293b;
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
    margin: 0;
    color: #64748b;
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .add-card-form {
    background: #f8fafc;
    border-radius: 12px;
    padding: 1.25rem;
    border: 2px dashed #cbd5e1;
  }

  .card-input, .card-textarea {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem;
    margin-bottom: 0.75rem;
    font-family: inherit;
    font-size: 0.875rem;
    transition: border-color 0.2s ease;
  }

  .card-input:focus, .card-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    background: #f8fafc;
    border: 2px dashed #3b82f6;
    border-radius: 12px;
    color: #3b82f6;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .add-card-btn:hover {
    background: #eff6ff;
    border-style: solid;
  }
</style>