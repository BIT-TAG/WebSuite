// src/lib/stores/view.js
import { writable } from 'svelte/store';

export const currentView = writable('desktop'); // 'desktop' oder 'dashboard'

export function switchToDesktop() {
  currentView.set('desktop');
}

export function switchToDashboard() {
  currentView.set('dashboard');
}