// src/lib/stores/widgets.js
import { writable } from 'svelte/store';

export const widgets = writable([
  {
    id: 'welcome-widget',
    title: 'Willkommen bei LibreWorkspace',
    type: 'markdown',
    content: `# 👋 Willkommen!

**LibreWorkspace** ist Ihr persönlicher Arbeitsbereich für maximale Produktivität.

## 🚀 Schnellstart
- Erstellen Sie Projekte im **Kanban Board**
- Nutzen Sie den **Pomodoro Timer** für fokussiertes Arbeiten
- Verwalten Sie Ihre Aufgaben effizient

## 📚 Nützliche Links
- [Dokumentation](https://docs.libreworkspace.com)
- [Support Center](https://support.libreworkspace.com)
- [Community Forum](https://community.libreworkspace.com)

> 💡 **Tipp**: Passen Sie Ihr Dashboard mit eigenen Widgets an!`,
    position: { x: 20, y: 20 },
    size: { width: 380, height: 320 },
    visible: true,
    color: 'blue'
  },
  {
    id: 'productivity-stats',
    title: 'Produktivitäts-Übersicht',
    type: 'html',
    content: `<div class="stats-container">
  <div class="stats-grid">
    <div class="stat-card primary">
      <div class="stat-icon">📋</div>
      <div class="stat-content">
        <div class="stat-number">24</div>
        <div class="stat-label">Offene Tasks</div>
      </div>
    </div>
    
    <div class="stat-card success">
      <div class="stat-icon">✅</div>
      <div class="stat-content">
        <div class="stat-number">18</div>
        <div class="stat-label">Erledigt heute</div>
      </div>
    </div>
    
    <div class="stat-card warning">
      <div class="stat-icon">🍅</div>
      <div class="stat-content">
        <div class="stat-number">6</div>
        <div class="stat-label">Pomodoros</div>
      </div>
    </div>
    
    <div class="stat-card info">
      <div class="stat-icon">⏱️</div>
      <div class="stat-content">
        <div class="stat-number">4h 30m</div>
        <div class="stat-label">Arbeitszeit</div>
      </div>
    </div>
  </div>
  
  <div class="progress-section">
    <div class="progress-header">
      <span>Wochenziel</span>
      <span>75%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 75%"></div>
    </div>
  </div>
</div>

<style>
.stats-container {
  padding: 1.5rem;
  font-family: Inter, sans-serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-card.primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.stat-card.success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
.stat-card.warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
.stat-card.info { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }

.stat-icon {
  font-size: 1.5rem;
  opacity: 0.9;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
  font-weight: 500;
}

.progress-section {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.progress-bar {
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>`,
    position: { x: 420, y: 20 },
    size: { width: 320, height: 280 },
    visible: true,
    color: 'green'
  },
  {
    id: 'quick-notes',
    title: 'Schnelle Notizen',
    type: 'markdown',
    content: `## 📝 Heute erledigen

### Priorität Hoch
- [ ] Kundenpräsentation vorbereiten
- [ ] Code Review für Feature XY
- [x] ~~Meeting mit Team Lead~~

### Priorität Normal  
- [ ] Dokumentation aktualisieren
- [ ] E-Mails beantworten
- [x] ~~Dashboard Widgets implementieren~~

### Ideen & Notizen
- Widget für Kalender-Integration
- Automatische Backup-Funktion
- Mobile App Konzept

---

**Letzte Aktualisierung:** ${new Date().toLocaleDateString('de-DE')}`,
    position: { x: 20, y: 360 },
    size: { width: 380, height: 300 },
    visible: true,
    color: 'purple'
  },
  {
    id: 'system-info',
    title: 'System Status',
    type: 'html',
    content: `<div class="system-info">
  <div class="status-grid">
    <div class="status-item online">
      <div class="status-indicator"></div>
      <div class="status-content">
        <div class="status-title">LibreWorkspace Server</div>
        <div class="status-subtitle">Online • 99.9% Uptime</div>
      </div>
    </div>
    
    <div class="status-item online">
      <div class="status-indicator"></div>
      <div class="status-content">
        <div class="status-title">Synchronisation</div>
        <div class="status-subtitle">Aktiv • Letzte Sync: vor 2 Min</div>
      </div>
    </div>
    
    <div class="status-item warning">
      <div class="status-indicator"></div>
      <div class="status-content">
        <div class="status-title">Speicher</div>
        <div class="status-subtitle">78% belegt • 2.1 GB frei</div>
      </div>
    </div>
  </div>
  
  <div class="quick-actions">
    <button class="action-btn primary">🔄 Sync starten</button>
    <button class="action-btn secondary">⚙️ Einstellungen</button>
  </div>
</div>

<style>
.system-info {
  padding: 1.5rem;
  font-family: Inter, sans-serif;
}

.status-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.status-item:hover {
  background: var(--bg-hover);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-item.online .status-indicator {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-item.warning .status-indicator {
  background: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.status-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.status-subtitle {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: var(--accent-color);
  color: var(--accent-foreground);
}

.action-btn.primary:hover {
  background: var(--accent-hover);
}

.action-btn.secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.action-btn.secondary:hover {
  background: var(--bg-hover);
}
</style>`,
    position: { x: 760, y: 20 },
    size: { width: 300, height: 260 },
    visible: true,
    color: 'orange'
  }
]);

export function addWidget(widget) {
  widgets.update(w => [...w, {
    ...widget,
    id: crypto.randomUUID(),
    position: widget.position || { x: 50, y: 50 },
    size: widget.size || { width: 300, height: 200 },
    visible: true,
    color: widget.color || 'blue'
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

export function duplicateWidget(id) {
  widgets.update(w => {
    const widget = w.find(widget => widget.id === id);
    if (widget) {
      const duplicate = {
        ...widget,
        id: crypto.randomUUID(),
        title: `${widget.title} (Kopie)`,
        position: { 
          x: widget.position.x + 20, 
          y: widget.position.y + 20 
        }
      };
      return [...w, duplicate];
    }
    return w;
  });
}