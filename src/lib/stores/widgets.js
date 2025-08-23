// src/lib/stores/widgets.js
import { writable } from 'svelte/store';

export const widgets = writable([
  {
    id: 'welcome-widget',
    title: 'Willkommen',
    type: 'markdown',
    content: `# Willkommen bei LibreWorkspace! 👋

Hier sind einige **wichtige Links**:

- [Dokumentation](https://docs.libreworkspace.com)
- [Support](https://support.libreworkspace.com)
- [Community](https://community.libreworkspace.com)

> 💡 **Tipp**: Sie können Widgets mit HTML oder Markdown erstellen!`,
    position: { x: 0, y: 0 },
    size: { width: 300, height: 250 },
    visible: true
  },
  {
    id: 'stats-widget',
    title: 'Statistiken',
    type: 'html',
    content: `<div style="padding: 1rem; font-family: Inter, sans-serif;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
      <div style="font-size: 2rem; font-weight: bold; color: var(--accent-color);">24</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Offene Tasks</div>
    </div>
    <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
      <div style="font-size: 2rem; font-weight: bold; color: #10b981;">12</div>
      <div style="font-size: 0.875rem; color: var(--text-secondary);">Erledigt</div>
    </div>
  </div>
  <div style="text-align: center; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
    <div style="font-size: 1.5rem; font-weight: bold; color: #f59e0b;">3h 45m</div>
    <div style="font-size: 0.875rem; color: var(--text-secondary);">Heute gearbeitet</div>
  </div>
</div>`,
    position: { x: 320, y: 0 },
    size: { width: 280, height: 200 },
    visible: true
  },
  {
    id: 'weather-widget',
    title: 'Wetter',
    type: 'html',
    content: `<div style="padding: 1.5rem; text-align: center; font-family: Inter, sans-serif;">
  <div style="font-size: 3rem; margin-bottom: 0.5rem;">☀️</div>
  <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary); margin-bottom: 0.25rem;">22°C</div>
  <div style="color: var(--text-secondary); margin-bottom: 1rem;">Sonnig</div>
  <div style="display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-secondary);">
    <span>Min: 18°C</span>
    <span>Max: 25°C</span>
  </div>
</div>`,
    position: { x: 620, y: 0 },
    size: { width: 200, height: 180 },
    visible: true
  },
  {
    id: 'notes-widget',
    title: 'Schnelle Notizen',
    type: 'markdown',
    content: `## 📝 Notizen

### Heute erledigen:
- [ ] Meeting um 14:00
- [ ] Code Review
- [x] Dashboard Widgets implementieren

### Ideen:
- Widget für Kalender
- Integration mit Todoist
- Dark Mode für alle Widgets`,
    position: { x: 0, y: 270 },
    size: { width: 320, height: 220 },
    visible: true
  }
]);

export function addWidget(widget) {
  widgets.update(w => [...w, {
    ...widget,
    id: crypto.randomUUID()
  }]);
}

export function updateWidget(id, updates) {
  widgets.update(w => 
    w.map(widget => 
      widget.id === id 
        ? { ...widget, ...updates }
        : widget
    )
  );
}

export function deleteWidget(id) {
  widgets.update(w => w.filter(widget => widget.id !== id));
}

export function toggleWidgetVisibility(id) {
  widgets.update(w => 
    w.map(widget => 
      widget.id === id 
        ? { ...widget, visible: !widget.visible }
        : widget
    )
  );
}