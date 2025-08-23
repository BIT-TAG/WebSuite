<script>
  import { 
    pomodoroState, 
    selectedTask, 
    formattedTime, 
    progressPercentage,
    startPomodoro, 
    pausePomodoro, 
    resumePomodoro, 
    stopPomodoro,
    completeCurrentTask,
    setWorkSession,
    setShortBreak,
    setLongBreak
  } from '$lib/stores/pomodoro';
  import { kanbanBoards, activeBoard, completeTask } from '$lib/stores/kanban';
  import { Button, Card } from '$lib/components/ui';
  import { Tabs, TabsList, TabsTrigger, Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui';
  import { Play, Pause, Square, CheckCircle, List } from 'lucide-svelte';
  
  let showTaskSelector = false;
  let availableTasks = [];
  
  $: {
    const board = $kanbanBoards.find(b => b.id === $activeBoard);
    if (board) {
      availableTasks = board.columns.flatMap(col => 
        col.cards.map(card => ({
          ...card,
          columnTitle: col.title
        }))
      );
    }
  }
  
  function selectTask(task) {
    selectedTask.set(task);
    showTaskSelector = false;
  }
  
  function handleStart() {
    if ($selectedTask) {
      startPomodoro($selectedTask);
    } else {
      startPomodoro();
    }
  }
  
  function handleCompleteTask() {
    if ($selectedTask) {
      completeTask($activeBoard, $selectedTask.id);
      completeCurrentTask();
    }
  }
  
  function getSessionLabel(session) {
    switch(session) {
      case 'work': return 'Arbeitszeit';
      case 'shortBreak': return 'Kurze Pause';
      case 'longBreak': return 'Lange Pause';
      default: return 'Arbeitszeit';
    }
  }
  
  function getSessionEmoji(session) {
    switch(session) {
      case 'work': return '🍅';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🛋️';
      default: return '🍅';
    }
  }
</script>

<Card class="mx-auto w-full max-w-md p-6">
  <div class="mb-6 text-center">
    <h3 class="mb-2 text-xl font-light text-foreground">
      {getSessionEmoji($pomodoroState.session)} Pomodoro Timer
    </h3>
    <div class="flex items-center justify-between text-sm">
      <span class="text-primary font-medium">
        {getSessionLabel($pomodoroState.session)}
      </span>
      <span class="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
        Session {$pomodoroState.completedSessions + 1}
      </span>
    </div>
  </div>
  
  <div class="mb-6 flex justify-center">
    <div class="relative h-48 w-48">
      <svg class="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          class="text-muted"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
          stroke-dasharray="283"
          stroke-dashoffset={283 - (283 * $progressPercentage) / 100}
          class="text-primary transition-all duration-1000 ease-in-out"
          stroke-linecap="round"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-3xl font-light text-foreground">{$formattedTime}</span>
      </div>
    </div>
  </div>
  
  {#if $selectedTask}
    <Card class="mb-4 p-4">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <h4 class="font-medium text-foreground">{$selectedTask.title}</h4>
          <p class="text-sm text-muted-foreground">({$selectedTask.columnTitle})</p>
        </div>
        <div class="flex gap-2">
          <Button size="sm" on:click={handleCompleteTask}>
            <CheckCircle class="mr-1 h-3 w-3" />
            Erledigt
          </Button>
          <Button variant="outline" size="sm" on:click={() => showTaskSelector = true}>
            Ändern
          </Button>
        </div>
      </div>
    </Card>
  {:else}
    <div class="mb-4 text-center">
      <Button variant="outline" on:click={() => showTaskSelector = true}>
        <List class="mr-2 h-4 w-4" />
        Task auswählen
      </Button>
    </div>
  {/if}
  
  <div class="mb-4 flex justify-center gap-2">
    {#if !$pomodoroState.isRunning && !$pomodoroState.isPaused}
      <Button on:click={handleStart}>
        <Play class="mr-2 h-4 w-4" />
        Start
      </Button>
    {:else if $pomodoroState.isRunning && !$pomodoroState.isPaused}
      <Button variant="outline" on:click={pausePomodoro}>
        <Pause class="mr-2 h-4 w-4" />
        Pause
      </Button>
    {:else if $pomodoroState.isPaused}
      <Button on:click={resumePomodoro}>
        <Play class="mr-2 h-4 w-4" />
        Weiter
      </Button>
    {/if}
    
    {#if $pomodoroState.isRunning || $pomodoroState.isPaused}
      <Button variant="destructive" on:click={stopPomodoro}>
        <Square class="mr-2 h-4 w-4" />
        Stop
      </Button>
    {/if}
  </div>
  
  <Tabs value={$pomodoroState.session} class="w-full">
    <TabsList class="grid w-full grid-cols-3">
      <TabsTrigger 
        value="work" 
        on:click={setWorkSession}
        disabled={$pomodoroState.isRunning}
        class="text-xs"
      >
        Arbeit (25min)
      </TabsTrigger>
      <TabsTrigger 
        value="shortBreak" 
        on:click={setShortBreak}
        disabled={$pomodoroState.isRunning}
        class="text-xs"
      >
        Pause (5min)
      </TabsTrigger>
      <TabsTrigger 
        value="longBreak" 
        on:click={setLongBreak}
        disabled={$pomodoroState.isRunning}
        class="text-xs"
      >
        Lange (15min)
      </TabsTrigger>
    </TabsList>
  </Tabs>
</Card>

<Dialog bind:open={showTaskSelector}>
  <DialogContent class="max-w-md">
    <DialogHeader>
      <DialogTitle>Task auswählen</DialogTitle>
    </DialogHeader>
    
    <div class="max-h-80 space-y-2 overflow-y-auto">
      {#each availableTasks as task}
        <Card 
          class="cursor-pointer p-3 transition-colors hover:bg-muted/50"
          on:click={() => selectTask(task)}
        >
          <h4 class="font-medium text-foreground">{task.title}</h4>
          <div class="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{task.columnTitle}</span>
            {#if task.description}
              <span>•</span>
              <span class="truncate">{task.description}</span>
            {/if}
          </div>
        </Card>
      {/each}
      
      {#if availableTasks.length === 0}
        <div class="py-8 text-center text-muted-foreground">
          Keine Tasks verfügbar. Erstellen Sie Tasks im Kanban Board.
        </div>
      {/if}
    </div>
    
    <div class="flex justify-center pt-4">
      <Button 
        variant="outline" 
        on:click={() => { selectedTask.set(null); showTaskSelector = false; }}
      >
        Ohne Task arbeiten
      </Button>
    </div>
  </DialogContent>
</Dialog>