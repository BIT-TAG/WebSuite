import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Default settings
const defaultSettings = {
  theme: 'dark', // 'light' or 'dark'
  accentColor: 'blue' // 'blue', 'green', 'purple', 'orange', 'red'
};

// Load settings from localStorage if available
function loadSettings() {
  if (browser) {
    const saved = localStorage.getItem('websuite-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch (e) {
        console.warn('Failed to parse saved settings:', e);
      }
    }
  }
  return defaultSettings;
}

export const settings = writable(loadSettings());

// Save settings to localStorage whenever they change
if (browser) {
  settings.subscribe(value => {
    localStorage.setItem('websuite-settings', JSON.stringify(value));
    applyTheme(value);
  });
}

export function setTheme(theme) {
  settings.update(s => ({ ...s, theme }));
}

export function setAccentColor(color) {
  settings.update(s => ({ ...s, accentColor: color }));
}

function applyTheme(settings) {
  if (!browser) return;
  
  const root = document.documentElement;
  
  // Apply theme
  if (settings.theme === 'dark') {
    root.classList.add('dark-theme');
  } else {
    root.classList.remove('dark-theme');
  }
  
  // Apply accent color
  root.setAttribute('data-accent', settings.accentColor);
}

// Apply theme on initial load
if (browser) {
  settings.subscribe(applyTheme);
}