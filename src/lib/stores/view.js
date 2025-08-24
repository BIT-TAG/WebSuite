// src/lib/stores/view.js
import { writable } from 'svelte/store';
import { settings } from './settings';
import { get } from 'svelte/store';

export const currentView = writable('dashboard'); // 'desktop', 'dashboard' oder 'kanban'

export function switchToDesktop() {
  currentView.set('desktop');
}

export function switchToDashboard() {
  currentView.set('dashboard');
}

export function switchToKanban() {
  const currentSettings = get(settings);
  if (currentSettings.betaMode) {
    currentView.set('kanban');
  } else {
    // Fallback to dashboard if beta mode is not enabled
    currentView.set('dashboard');
  }
}