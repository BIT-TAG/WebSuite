<!-- src/lib/components/PomodoroTimer.svelte -->
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
  
  let showTaskSelector = false;
  let availableTasks = [];
  
  $: {
    // Alle verfügbaren Tasks aus dem aktiven Kanban Board sammeln
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
      // Task im Kanban Board als erledigt markieren
      completeTask($activeBoard, $selectedTask.id);
      // Task aus dem Pomodoro Timer entfernen
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
  
  function getSessionColor(session) {
    switch(session) {
      case 'work': return '#4caf50';
      case 'shortBreak': return '#ff9800';
      case 'longBreak': return '#2196f3';
      default: return '#4caf50';
    }
  }
</script>

<div class="pomodoro-container">
  <div class="pomodoro-header">
    <h3>🍅 Pomodoro Timer</h3>
    <div class="session-info">
      <span class="session-label" style="color: {getSessionColor($pomodoroState.session)}">
        {getSessionLabel($pomodoroState.session)}
      </span>
      <span class="completed-sessions">
        Session {$pomodoroState.completedSessions + 1}
      </span>
    </div>
  </div>
  
  <div class="timer-display">
    <div class="time-circle" style="--progress: {$progressPercentage}%; --color: {getSessionColor($pomodoroState.session)}">
      <div class="time-text">{$formattedTime}</div>
    </div>
  </div>
  
  {#if $selectedTask}
    <div class="current-task">
      <div class="task-info">
        <strong>{$selectedTask.title}</strong>
        <span class="task-column">({$selectedTask.columnTitle})</span>
      </div>
      <div class="task-actions">
        <button class="complete-task-btn" on:click={handleCompleteTask}>
          ✅ Erledigt
        </button>
        <button class="change-task-btn" on:click={() => showTaskSelector = true}>
          Ändern
        </button>
      </div>
    </div>
  {:else}
    <div class="no-task">
      <button class="select-task-btn" on:click={() => showTaskSelector = true}>
        📋 Task auswählen
      </button>
    </div>
  {/if}
  
  <div class="timer-controls">
    {#if !$pomodoroState.isRunning && !$pomodoroState.isPaused}
      <button class="control-btn start-btn" on:click={handleStart}>
        ▶️ Start
      </button>
    {:else if $pomodoroState.isRunning && !$pomodoroState.isPaused}
      <button class="control-btn pause-btn" on:click={pausePomodoro}>
        ⏸️ Pause
      </button>
    {:else if $pomodoroState.isPaused}
      <button class="control-btn resume-btn" on:click={resumePomodoro}>
        ▶️ Weiter
      </button>
    {/if}
    
    {#if $pomodoroState.isRunning || $pomodoroState.isPaused}
      <button class="control-btn stop-btn" on:click={stopPomodoro}>
        ⏹️ Stop
      </button>
    {/if}
  </div>
  
  <div class="session-controls">
    <button 
      class="session-btn" 
      class:active={$pomodoroState.session === 'work'}
      on:click={setWorkSession}
      disabled={$pomodoroState.isRunning}
    >
      Arbeit (25min)
    </button>
    <button 
      class="session-btn" 
      class:active={$pomodoroState.session === 'shortBreak'}
      on:click={setShortBreak}
      disabled={$pomodoroState.isRunning}
    >
      Pause (5min)
    </button>
    <button 
      class="session-btn" 
      class:active={$pomodoroState.session === 'longBreak'}
      on:click={setLongBreak}
      disabled={$pomodoroState.isRunning}
    >
      Lange Pause (15min)
    </button>
  </div>
</div>

{#if showTaskSelector}
  <div class="task-selector-overlay" on:click={() => showTaskSelector = false}>
    <div class="task-selector" on:click|stopPropagation>
      <div class="selector-header">
        <h4>Task auswählen</h4>
        <button class="close-btn" on:click={() => showTaskSelector = false}>✖</button>
      </div>
      
      <div class="task-list">
        {#each availableTasks as task}
          <div class="task-item" on:click={() => selectTask(task)}>
            <div class="task-title">{task.title}</div>
            <div class="task-meta">
              <span class="task-column">{task.columnTitle}</span>
              {#if task.description}
                <span class="task-description">{task.description}</span>
              {/if}
            </div>
          </div>
        {/each}
        
        {#if availableTasks.length === 0}
          <div class="no-tasks">
            Keine Tasks verfügbar. Erstellen Sie Tasks im Kanban Board.
          </div>
        {/if}
      </div>
      
      <div class="selector-footer">
        <button class="clear-task-btn" on:click={() => { selectedTask.set(null); showTaskSelector = false; }}>
          Ohne Task arbeiten
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .pomodoro-container {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 2);
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    max-width: 420px;
    margin: 0 auto;
  }
  
  .pomodoro-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .pomodoro-header h3 {
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .session-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }
  
  .session-label {
    font-weight: 500;
  }
  
  .completed-sessions {
    color: var(--text-muted);
    background: var(--bg-secondary);
    padding: 0.375rem 0.75rem;
    border-radius: calc(var(--radius) * 2);
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .timer-display {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  .time-circle {
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: conic-gradient(var(--color) var(--progress), #e0e0e0 var(--progress));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .time-circle::before {
    content: '';
    position: absolute;
    width: 180px;
    height: 180px;
    background: var(--bg-primary);
    border-radius: 50%;
  }
  
  .time-text {
    font-size: 2.25rem;
    font-weight: 600;
    color: var(--text-primary);
    z-index: 1;
    font-family: 'Courier New', monospace;
  }
  
  .current-task {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .task-info {
    flex: 1;
  }
  
  .task-info strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
  }
  
  .task-column {
    color: var(--text-muted);
    font-size: 0.8125rem;
  }
  
  .task-actions {
    display: flex;
    gap: 0.75rem;
  }
  
  .complete-task-btn {
    background: hsl(142.1 76.2% 36.3%);
    color: var(--accent-foreground);
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .complete-task-btn:hover {
    background: hsl(142.1 76.2% 31%);
  }
  
  .change-task-btn {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .change-task-btn:hover {
    background: var(--accent-hover);
  }
  
  .no-task {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .select-task-btn {
    background: hsl(24.6 95% 53.1%);
    color: var(--accent-foreground);
    border: none;
    padding: 1rem 2rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .select-task-btn:hover {
    background: hsl(24.6 95% 48%);
  }
  
  .timer-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .control-btn {
    padding: 0.875rem 1.75rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .start-btn, .resume-btn {
    background: hsl(142.1 76.2% 36.3%);
    color: var(--accent-foreground);
  }
  
  .start-btn:hover, .resume-btn:hover {
    background: hsl(142.1 76.2% 31%);
  }
  
  .pause-btn {
    background: hsl(24.6 95% 53.1%);
    color: var(--accent-foreground);
  }
  
  .pause-btn:hover {
    background: hsl(24.6 95% 48%);
  }
  
  .stop-btn {
    background: hsl(0 84.2% 60.2%);
    color: var(--accent-foreground);
  }
  
  .stop-btn:hover {
    background: hsl(0 84.2% 55%);
  }
  
  .session-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
  
  .session-btn {
    padding: 0.625rem 1rem;
    border: 1px solid var(--border);
    background: var(--bg-primary);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 150ms ease;
    color: var(--text-muted);
  }
  
  .session-btn:hover:not(:disabled) {
    border-color: var(--accent-color);
    color: var(--accent-color);
    background: var(--bg-hover);
  }
  
  .session-btn.active {
    background: var(--accent-color);
    color: var(--accent-foreground);
    border-color: var(--accent-color);
  }
  
  .session-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .task-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .task-selector {
    background: var(--bg-primary);
    border: 1px solid var(--border);
    border-radius: calc(var(--radius) * 2);
    width: 90%;
    max-width: 520px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  }
  
  .selector-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .selector-header h4 {
    margin: 0;
    color: var(--text-primary);
    font-weight: 500;
    font-size: 1.125rem;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: var(--text-muted);
    padding: 0.25rem;
    border-radius: var(--radius);
    transition: all 150ms ease;
  }
  
  .close-btn:hover {
    color: var(--text-primary);
    background: var(--bg-hover);
  }
  
  .task-list {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
  }
  
  .task-item {
    padding: 1.25rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: all 150ms ease;
  }
  
  .task-item:hover {
    background: var(--bg-hover);
    border-color: var(--accent-color);
  }
  
  .task-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }
  
  .task-meta {
    display: flex;
    gap: 1.25rem;
    font-size: 0.8125rem;
    color: var(--text-muted);
  }
  
  .task-description {
    flex: 1;
  }
  
  .no-tasks {
    text-align: center;
    color: var(--text-muted);
    padding: 3rem 2rem;
    font-style: italic;
  }
  
  .selector-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--border);
    text-align: center;
  }
  
  .clear-task-btn {
    background: var(--text-muted);
    color: var(--accent-foreground);
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 150ms ease;
  }
  
  .clear-task-btn:hover {
    background: var(--text-secondary);
  }
</style>