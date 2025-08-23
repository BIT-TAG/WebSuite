<!-- src/lib/components/KanbanBoard.svelte -->
<script>
  import { kanbanBoards, activeBoard, addCard, moveCard, deleteCard } from '$lib/stores/kanban';
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
                  <button 
                    class="delete-btn"
                    on:click={() => deleteCard($activeBoard, column.id, card.id)}
                    aria-label="Karte löschen"
                  >
                    ✖
                  </button>
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
    padding: 2rem;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .kanban-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .kanban-header h2 {
    color: #1565c0;
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .kanban-board {
    display: flex;
    gap: 1.5rem;
    height: calc(100% - 6rem);
    overflow-x: auto;
    padding-bottom: 1rem;
  }

  .kanban-column {
    min-width: 300px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .column-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e3f2fd;
  }

  .column-header h3 {
    margin: 0;
    color: #1565c0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .card-count {
    background: #1565c0;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }

  .cards-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    margin-bottom: 1rem;
  }

  .kanban-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    cursor: grab;
    transition: all 0.2s ease;
  }

  .kanban-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  .kanban-card:active {
    cursor: grabbing;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .card-header h4 {
    margin: 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
    flex: 1;
  }

  .delete-btn {
    background: rgba(244, 67, 54, 0.1);
    border: none;
    color: #f44336;
    padding: 0.25rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }

  .delete-btn:hover {
    background: rgba(244, 67, 54, 0.2);
  }

  .card-description {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .add-card-form {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 1rem;
    border: 2px dashed #ccc;
  }

  .card-input, .card-textarea {
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    font-family: inherit;
    font-size: 0.9rem;
  }

  .card-input:focus, .card-textarea:focus {
    outline: none;
    border-color: #1565c0;
  }

  .form-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .save-btn, .cancel-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .save-btn {
    background: #4caf50;
    color: white;
  }

  .save-btn:hover {
    background: #45a049;
  }

  .cancel-btn {
    background: #f44336;
    color: white;
  }

  .cancel-btn:hover {
    background: #da190b;
  }

  .add-card-btn {
    width: 100%;
    padding: 0.75rem;
    background: rgba(21, 101, 192, 0.1);
    border: 2px dashed #1565c0;
    border-radius: 8px;
    color: #1565c0;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .add-card-btn:hover {
    background: rgba(21, 101, 192, 0.2);
    border-style: solid;
  }
</style>