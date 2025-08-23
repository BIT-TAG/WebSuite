<script>
  import { kanbanBoards, activeBoard, addCard, deleteCard, setBoardViewMode } from '$lib/stores/kanban';
  import { startPomodoro } from '$lib/stores/pomodoro';
  import { switchToDesktop } from '$lib/stores/view';
  import { dndzone } from 'svelte-dnd-action';
  import ListView from './ListView.svelte';
  import GanttView from './GanttView.svelte';
  import { Button, Card, Input, Textarea, Badge } from '$lib/components/ui';
  import { Tabs, TabsList, TabsTrigger } from '$lib/components/ui';
  import { Plus, Timer, X } from 'lucide-svelte';
  
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

  function getPriorityVariant(priority) {
    switch(priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
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
</script>

<div class="flex h-full flex-col bg-background p-6">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-2xl font-light tracking-tight text-foreground">
      📋 {currentBoard?.title || 'Kanban Board'}
    </h2>
    
    <Tabs value={viewMode} class="w-auto">
      <TabsList>
        <TabsTrigger value="kanban" on:click={() => switchView('kanban')}>
          📋 Kanban
        </TabsTrigger>
        <TabsTrigger value="list" on:click={() => switchView('list')}>
          📝 Liste
        </TabsTrigger>
        <TabsTrigger value="gantt" on:click={() => switchView('gantt')}>
          📊 Gantt
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
  
  {#if currentBoard}
    <div class="flex-1 overflow-hidden">
      {#if viewMode === 'kanban'}
        <div class="flex h-full gap-6 overflow-x-auto pb-4">
          {#each currentBoard.columns as column (column.id)}
            <div class="flex min-w-80 flex-col">
              <Card class="flex-1 p-4">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="font-medium text-foreground">{column.title}</h3>
                  <Badge variant="secondary" class="text-xs">
                    {column.cards.length}
                  </Badge>
                </div>
                
                <div 
                  class="mb-4 flex flex-1 flex-col gap-3 overflow-y-auto"
                  use:dndzone={{
                    items: column.cards,
                    flipDurationMs: 300,
                    dropTargetStyle: {}
                  }}
                  on:consider={(e) => handleDndConsider(column.id, e)}
                  on:finalize={(e) => handleDndFinalize(column.id, e)}
                >
                  {#each column.cards as card (card.id)}
                    <Card class="group cursor-grab p-4 transition-all hover:shadow-md active:cursor-grabbing" data-id={card.id}>
                      <div class="mb-2 flex items-start justify-between">
                        <h4 class="font-medium text-foreground">{card.title}</h4>
                        <div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            class="h-6 w-6"
                            on:click={() => startPomodoroWithTask(card)}
                          >
                            <Timer class="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            class="h-6 w-6 text-destructive hover:text-destructive"
                            on:click={() => deleteCard($activeBoard, column.id, card.id)}
                          >
                            <X class="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {#if card.description}
                        <p class="mb-3 text-sm text-muted-foreground">{card.description}</p>
                      {/if}
                      
                      {#if card.priority || card.assignee}
                        <div class="flex flex-wrap gap-2">
                          {#if card.priority}
                            <Badge variant={getPriorityVariant(card.priority)} class="text-xs">
                              {getPriorityLabel(card.priority)}
                            </Badge>
                          {/if}
                          {#if card.assignee}
                            <Badge variant="outline" class="text-xs">
                              👤 {card.assignee}
                            </Badge>
                          {/if}
                        </div>
                      {/if}
                    </Card>
                  {/each}
                </div>
                
                {#if showAddCard[column.id]}
                  <Card class="border-dashed p-4">
                    <div class="space-y-3">
                      <Input 
                        bind:value={newCardTitle}
                        placeholder="Titel der Karte..."
                        on:keydown={(e) => e.key === 'Enter' && handleAddCard(column.id)}
                      />
                      <Textarea 
                        bind:value={newCardDescription}
                        placeholder="Beschreibung (optional)..."
                        rows={2}
                      />
                      <div class="flex gap-2">
                        <Button size="sm" on:click={() => handleAddCard(column.id)}>
                          Speichern
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          on:click={() => showAddCard[column.id] = false}
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </Card>
                {:else}
                  <Button 
                    variant="ghost" 
                    class="w-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50"
                    on:click={() => showAddCard[column.id] = true}
                  >
                    <Plus class="mr-2 h-4 w-4" />
                    Karte hinzufügen
                  </Button>
                {/if}
              </Card>
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