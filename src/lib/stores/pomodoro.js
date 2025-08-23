import { writable, derived } from 'svelte/store';

export const pomodoroState = writable({
  isRunning: false,
  isPaused: false,
  timeLeft: 25 * 60, // 25 Minuten in Sekunden
  totalTime: 25 * 60,
  currentTask: null,
  session: 'work', // 'work', 'shortBreak', 'longBreak'
  completedSessions: 0
});

export const selectedTask = writable(null);

let interval = null;

export function startPomodoro(task = null) {
  pomodoroState.update(state => ({
    ...state,
    isRunning: true,
    isPaused: false,
    currentTask: task
  }));
  
  if (task) {
    selectedTask.set(task);
  }
  
  startTimer();
}

export function pausePomodoro() {
  pomodoroState.update(state => ({
    ...state,
    isPaused: true
  }));
  
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

export function resumePomodoro() {
  pomodoroState.update(state => ({
    ...state,
    isPaused: false
  }));
  
  startTimer();
}

export function stopPomodoro() {
  pomodoroState.update(state => ({
    ...state,
    isRunning: false,
    isPaused: false,
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    currentTask: null
  }));
  
  selectedTask.set(null);
  
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

export function completeCurrentTask() {
  pomodoroState.update(state => ({
    ...state,
    currentTask: null
  }));
  
  selectedTask.set(null);
}

export function setWorkSession() {
  pomodoroState.update(state => ({
    ...state,
    session: 'work',
    timeLeft: 25 * 60,
    totalTime: 25 * 60,
    isRunning: false,
    isPaused: false
  }));
}

export function setShortBreak() {
  pomodoroState.update(state => ({
    ...state,
    session: 'shortBreak',
    timeLeft: 5 * 60,
    totalTime: 5 * 60,
    isRunning: false,
    isPaused: false
  }));
}

export function setLongBreak() {
  pomodoroState.update(state => ({
    ...state,
    session: 'longBreak',
    timeLeft: 15 * 60,
    totalTime: 15 * 60,
    isRunning: false,
    isPaused: false
  }));
}

function startTimer() {
  if (interval) {
    clearInterval(interval);
  }
  
  interval = setInterval(() => {
    pomodoroState.update(state => {
      if (state.timeLeft <= 1) {
        // Timer abgelaufen
        clearInterval(interval);
        interval = null;
        
        // Session abgeschlossen
        const newCompletedSessions = state.completedSessions + 1;
        
        // Automatisch zur nächsten Session wechseln
        let nextSession = 'work';
        let nextTime = 25 * 60;
        
        if (state.session === 'work') {
          if (newCompletedSessions % 4 === 0) {
            nextSession = 'longBreak';
            nextTime = 15 * 60;
          } else {
            nextSession = 'shortBreak';
            nextTime = 5 * 60;
          }
        }
        
        return {
          ...state,
          isRunning: false,
          isPaused: false,
          timeLeft: nextTime,
          totalTime: nextTime,
          session: nextSession,
          completedSessions: newCompletedSessions,
          currentTask: nextSession === 'work' ? state.currentTask : null
        };
      }
      
      return {
        ...state,
        timeLeft: state.timeLeft - 1
      };
    });
  }, 1000);
}

export const formattedTime = derived(pomodoroState, ($pomodoroState) => {
  const minutes = Math.floor($pomodoroState.timeLeft / 60);
  const seconds = $pomodoroState.timeLeft % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

export const progressPercentage = derived(pomodoroState, ($pomodoroState) => {
  return ((($pomodoroState.totalTime - $pomodoroState.timeLeft) / $pomodoroState.totalTime) * 100);
});