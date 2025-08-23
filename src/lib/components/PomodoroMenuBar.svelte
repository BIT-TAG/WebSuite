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
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .timer-info {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .session-emoji {
    font-size: 1rem;
  }
  
  .timer-text {
    font-family: 'Courier New', monospace;
    font-weight: 600;
  }
  
  .paused-indicator {
    font-size: 0.8rem;
    opacity: 0.8;
  }
  
  .current-task-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 200px;
  }
  
  .task-separator {
    opacity: 0.5;
  }
  
  .task-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.85rem;
    opacity: 0.9;
  }
</style>