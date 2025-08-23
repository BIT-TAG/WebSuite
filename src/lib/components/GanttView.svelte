<!-- src/lib/components/GanttView.svelte -->
<script>
  import { kanbanBoards, activeBoard } from '$lib/stores/kanban';
  import { startPomodoro } from '$lib/stores/pomodoro';
  import { switchToDesktop } from '$lib/stores/view';
  
  $: currentBoard = $kanbanBoards.find(board => board.id === $activeBoard);
  $: allCards = currentBoard ? currentBoard.columns.flatMap(col => col.cards) : [];
  
  // Berechne Zeitraum für Gantt-Chart
  $: dateRange = calculateDateRange(allCards);
  $: timelineMonths = generateTimeline(dateRange);
  
  function calculateDateRange(cards) {
    if (cards.length === 0) return { start: new Date(), end: new Date() };
    
    const dates = cards.flatMap(card => [
      card.startDate ? new Date(card.startDate) : null,
      card.dueDate ? new Date(card.dueDate) : null
    ]).filter(Boolean);
    
    if (dates.length === 0) return { start: new Date(), end: new Date() };
    
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    
    // Erweitere um einen Monat vor und nach
    start.setMonth(start.getMonth() - 1);
    end.setMonth(end.getMonth() + 1);
    
    return { start, end };
  }
  
  function generateTimeline(range) {
    const months = [];
    const current = new Date(range.start);
    
    while (current <= range.end) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth(),
        label: current.toLocaleDateString('de-DE', { month: 'short', year: 'numeric' }),
        days: getDaysInMonth(current.getFullYear(), current.getMonth())
      });
      current.setMonth(current.getMonth() + 1);
    }
    
    return months;
  }
  
  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
  
  function calculateTaskPosition(card) {
    if (!card.startDate || !card.dueDate) return null;
    
    const start = new Date(card.startDate);
    const end = new Date(card.dueDate);
    const rangeStart = dateRange.start;
    const rangeEnd = dateRange.end;
    
    const totalDays = Math.ceil((rangeEnd - rangeStart) / (1000 * 60 * 60 * 24));
    const startOffset = Math.ceil((start - rangeStart) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    return {
      left: (startOffset / totalDays) * 100,
      width: (duration / totalDays) * 100
    };
  }
  
  function getPriorityColor(priority) {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  }
  
  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  }
  
  function startPomodoroWithTask(card) {
    startPomodoro(card);
    switchToDesktop();
  }
  
  function getProgress(card) {
    if (card.status === 'Done') return 100;
    if (card.status === 'In Progress') return 50;
    return 0;
  }
</script>

<div class="gantt-view">
  <div class="gantt-header">
    <div class="task-column">
      <div class="column-header">Tasks</div>
    </div>
    <div class="timeline-column">
      <div class="timeline-header">
        {#each timelineMonths as month}
          <div class="month-header" style="width: {(month.days / timelineMonths.reduce((sum, m) => sum + m.days, 0)) * 100}%">
            {month.label}
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <div class="gantt-content">
    {#each allCards as card}
      <div class="gantt-row">
        <div class="task-info">
          <div class="task-details">
            <div class="task-title">{card.title}</div>
            <div class="task-meta">
              <span class="task-status" style="background-color: {getPriorityColor(card.priority)}">
                {card.status}
              </span>
              {#if card.assignee}
                <span class="task-assignee">👤 {card.assignee}</span>
              {/if}
            </div>
            <div class="task-dates">
              {formatDate(card.startDate)} - {formatDate(card.dueDate)}
            </div>
          </div>
          <div class="task-actions">
            <button 
              class="action-btn pomodoro-btn"
              on:click={() => startPomodoroWithTask(card)}
              title="Pomodoro starten"
            >
              🍅
            </button>
          </div>
        </div>
        
        <div class="timeline-area">
          {#if calculateTaskPosition(card)}
            {@const position = calculateTaskPosition(card)}
            <div 
              class="task-bar"
              style="left: {position.left}%; width: {position.width}%; background-color: {getPriorityColor(card.priority)}"
            >
              <div class="task-progress" style="width: {getProgress(card)}%"></div>
              <div class="task-bar-label">{card.title}</div>
            </div>
          {:else}
            <div class="no-dates">Keine Daten verfügbar</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .gantt-view {
    height: 100%;
    background: var(--bg-primary);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
  }
  
  .gantt-header {
    display: flex;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .task-column {
    width: 300px;
    min-width: 300px;
    border-right: 1px solid var(--border-light);
  }
  
  .timeline-column {
    flex: 1;
    overflow-x: auto;
  }
  
  .column-header {
    padding: 1rem 1.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .timeline-header {
    display: flex;
    height: 100%;
  }
  
  .month-header {
    padding: 1rem 0.5rem;
    text-align: center;
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-secondary);
    border-right: 1px solid var(--border-light);
    min-width: 80px;
  }
  
  .gantt-content {
    flex: 1;
    overflow-y: auto;
  }
  
  .gantt-row {
    display: flex;
    border-bottom: 1px solid var(--border-light);
    min-height: 80px;
  }
  
  .gantt-row:hover {
    background: var(--bg-hover);
  }
  
  .task-info {
    width: 300px;
    min-width: 300px;
    padding: 1rem 1.5rem;
    border-right: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .task-details {
    flex: 1;
  }
  
  .task-title {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .task-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
  
  .task-status {
    padding: 0.25rem 0.625rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }
  
  .task-assignee {
    color: var(--text-secondary);
    font-size: 0.75rem;
  }
  
  .task-dates {
    color: var(--text-secondary);
    font-size: 0.75rem;
  }
  
  .task-actions {
    margin-left: 1rem;
  }
  
  .action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .pomodoro-btn {
    background: #fef3c7;
    color: #d97706;
  }
  
  .pomodoro-btn:hover {
    background: #fde68a;
    transform: scale(1.05);
  }
  
  .timeline-area {
    flex: 1;
    padding: 1rem 0.5rem;
    position: relative;
    min-height: 80px;
    display: flex;
    align-items: center;
  }
  
  .task-bar {
    position: relative;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    min-width: 60px;
    overflow: hidden;
  }
  
  .task-progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    transition: width 0.3s ease;
  }
  
  .task-bar-label {
    position: relative;
    z-index: 1;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .no-dates {
    color: var(--text-secondary);
    font-style: italic;
    font-size: 0.8125rem;
  }
</style>