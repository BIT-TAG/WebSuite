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
    setWorkSession,
    setShortBreak,
    setLongBreak
  } from '$lib/stores/pomodoro';
  import { kanbanBoards, activeBoard } from '$lib/stores/kanban';
  
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
      <button class="change-task-btn" on:click={() => showTaskSelector = true}>
        Ändern
      </button>
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
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 0 auto;
  }
  
  .pomodoro-header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .pomodoro-header h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.5rem;
  }
  
  .session-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
  }
  
  .session-label {
    font-weight: 600;
  }
  
  .completed-sessions {
    color: #666;
    background: #f5f5f5;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
  }
  
  .timer-display {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }
  
  .time-circle {
    width: 200px;
    height: 200px;
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
    width: 160px;
    height: 160px;
    background: white;
    border-radius: 50%;
  }
  
  .time-text {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    z-index: 1;
    font-family: 'Courier New', monospace;
  }
  
  .current-task {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .task-info {
    flex: 1;
  }
  
  .task-info strong {
    display: block;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .task-column {
    color: #666;
    font-size: 0.9rem;
  }
  
  .change-task-btn {
    background: #2196f3;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .change-task-btn:hover {
    background: #1976d2;
  }
  
  .no-task {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .select-task-btn {
    background: #ff9800;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .select-task-btn:hover {
    background: #f57c00;
  }
  
  .timer-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .control-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .start-btn, .resume-btn {
    background: #4caf50;
    color: white;
  }
  
  .start-btn:hover, .resume-btn:hover {
    background: #45a049;
  }
  
  .pause-btn {
    background: #ff9800;
    color: white;
  }
  
  .pause-btn:hover {
    background: #f57c00;
  }
  
  .stop-btn {
    background: #f44336;
    color: white;
  }
  
  .stop-btn:hover {
    background: #da190b;
  }
  
  .session-controls {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  
  .session-btn {
    padding: 0.5rem 0.75rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }
  
  .session-btn:hover:not(:disabled) {
    border-color: #2196f3;
    color: #2196f3;
  }
  
  .session-btn.active {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
  }
  
  .session-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .task-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  
  .task-selector {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .selector-header {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .selector-header h4 {
    margin: 0;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #666;
  }
  
  .close-btn:hover {
    color: #333;
  }
  
  .task-list {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .task-item {
    padding: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .task-item:hover {
    background: #f5f5f5;
    border-color: #2196f3;
  }
  
  .task-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .task-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .task-description {
    flex: 1;
  }
  
  .no-tasks {
    text-align: center;
    color: #666;
    padding: 2rem;
    font-style: italic;
  }
  
  .selector-footer {
    padding: 1rem;
    border-top: 1px solid #e0e0e0;
    text-align: center;
  }
  
  .clear-task-btn {
    background: #666;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .clear-task-btn:hover {
    background: #555;
  }
</style>