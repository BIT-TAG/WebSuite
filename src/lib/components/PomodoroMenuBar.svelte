<!-- src/lib/components/PomodoroMenuBar.svelte -->
<script>
  import { pomodoroState, selectedTask, formattedTime } from '$lib/stores/pomodoro';
  
  function getSessionEmoji(session) {
    switch(session) {
      case 'work': return '🍅';
      case 'shortBreak': return '☕';
      case 'longBreak': return '🛋️';
      default: return '🍅';
    }
  }
</script>

{#if $pomodoroState.isRunning || $pomodoroState.isPaused}
  <div class="pomodoro-menubar">
    <div class="timer-info">
      <span class="session-emoji">{getSessionEmoji($pomodoroState.session)}</span>
      <span class="timer-text">{$formattedTime}</span>
      {#if $pomodoroState.isPaused}
        <span class="paused-indicator">⏸️</span>
      {/if}
    </div>
    
    {#if $selectedTask}
      <div class="current-task-info">
        <span class="task-separator">|</span>
        <span class="task-title">{$selectedTask.title}</span>
      </div>
    {/if}
  </div>
{/if}

<style>
  .pomodoro-menubar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .timer-info {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  
  .session-emoji {
    font-size: 0.875rem;
  }
  
  .timer-text {
    font-family: 'Courier New', monospace;
    font-weight: 500;
    color: #1e293b;
  }
  
  .paused-indicator {
    font-size: 0.75rem;
    opacity: 0.7;
  }
  
  .current-task-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: 200px;
  }
  
  .task-separator {
    opacity: 0.4;
    color: #cbd5e1;
  }
  
  .task-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8125rem;
    color: #475569;
  }
</style>