// src/lib/stores/widgets.js
import { writable } from 'svelte/store';

// Grid-Typen und Validierung
export function clampSize(n) {
  return Math.max(1, Math.min(6, Math.round(n)));
}

export function normalizeDim(item) {
  if (item.kind === 'app') return { w: 1, h: 1 };
  return { 
    w: clampSize(item.dim?.w || 1), 
    h: clampSize(item.dim?.h || 1) 
  };
}

export function collide(a, b) {
  const ax2 = a.pos.x + a.dim.w;
  const ay2 = a.pos.y + a.dim.h;
  const bx2 = b.pos.x + b.dim.w;
  const by2 = b.pos.y + b.dim.h;
  return !(ax2 <= b.pos.x || bx2 <= a.pos.x || ay2 <= b.pos.y || by2 <= a.pos.y);
}

export function findFreeSpot(items, dim) {
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x <= 6 - dim.w; x++) {
      const candidate = { 
        pos: { x, y }, 
        dim,
        id: 'temp',
        kind: 'widget'
      };
      const hit = items.some(item => collide(candidate, item));
      if (!hit) return { x, y };
    }
  }
  return { x: 0, y: 0 };
}

// Apps Store
export const apps = writable([
  {
    id: 'wikipedia-app',
    name: 'Wikipedia',
    kind: 'app',
    icon: '📚',
    url: 'https://de.wikipedia.org',
    color: '#3b82f6',
    status: 'Installiert',
    descriptionShort: 'Online-Enzyklopädie mit Millionen von Artikeln',
    info: {
      format: 'markdown',
      content: `# Wikipedia

**Die freie Enzyklopädie**

Wikipedia ist ein freies, gemeinnütziges Projekt zur Erstellung einer Enzyklopädie in allen Sprachen der Welt.

## Features
- Über 6 Millionen Artikel in deutscher Sprache
- Kostenlos und werbefrei
- Von Freiwilligen erstellt und gepflegt
- Verfügbar in über 300 Sprachen

## Nutzung
Suchen Sie nach beliebigen Themen und erhalten Sie fundierte, quellenbasierte Informationen.`
    },
    pos: { x: 0, y: 0 },
    dim: { w: 1, h: 1 }
  },
  {
    id: 'calculator-app',
    name: 'Calculator',
    kind: 'app',
    icon: '🧮',
    url: 'https://www.calculator.net',
    color: '#10b981',
    status: 'Installiert',
    descriptionShort: 'Wissenschaftlicher Taschenrechner für komplexe Berechnungen',
    info: {
      format: 'html',
      content: `<h1>Calculator</h1>
<p><strong>Professioneller Online-Rechner</strong></p>
<p>Ein vollwertiger wissenschaftlicher Taschenrechner mit erweiterten Funktionen.</p>
<h2>Funktionen</h2>
<ul>
<li>Grundrechenarten (+, -, ×, ÷)</li>
<li>Wissenschaftliche Funktionen (sin, cos, tan, log)</li>
<li>Statistik und Wahrscheinlichkeit</li>
<li>Einheitenumrechnung</li>
</ul>`
    },
    pos: { x: 1, y: 0 },
    dim: { w: 1, h: 1 }
  },
  {
    id: 'notes-app',
    name: 'Notes',
    kind: 'app',
    icon: '📝',
    url: 'https://keep.google.com',
    color: '#f59e0b',
    status: 'Installiert',
    descriptionShort: 'Notizen und Erinnerungen organisieren',
    info: {
      format: 'markdown',
      content: `# Google Keep Notes

**Ihre Gedanken, überall verfügbar**

Erfassen Sie Ideen, erstellen Sie Listen und setzen Sie Erinnerungen – alles an einem Ort.

## Features
- **Schnelle Notizen** - Gedanken sofort festhalten
- **Listen** - To-Do-Listen und Einkaufslisten
- **Erinnerungen** - Zeitbasierte und ortsbasierte Alerts
- **Zusammenarbeit** - Notizen mit anderen teilen
- **Suche** - Alle Notizen durchsuchbar

Synchronisiert automatisch zwischen allen Ihren Geräten.`
    },
    pos: { x: 2, y: 0 },
    dim: { w: 1, h: 1 }
  },
  {
    id: 'weather-app',
    name: 'Weather',
    kind: 'app',
    icon: '🌤️',
    url: 'https://weather.com',
    color: '#8b5cf6',
    status: 'Installiert',
    descriptionShort: 'Aktuelle Wettervorhersagen und Warnungen',
    info: {
      format: 'markdown',
      content: `# Weather.com

**Präzise Wettervorhersagen weltweit**

Bleiben Sie über das Wetter in Ihrer Region und weltweit informiert.

## Features
- **Aktuelle Bedingungen** - Live-Wetterdaten
- **10-Tage-Vorhersage** - Detaillierte Prognosen
- **Radar & Karten** - Interaktive Wetterkarten
- **Wetterwarnungen** - Unwetter-Alerts
- **Stündliche Vorhersage** - Präzise Stundenprognosen

Powered by The Weather Channel.`
    },
    pos: { x: 3, y: 0 },
    dim: { w: 1, h: 1 }
  },
  {
    id: 'calendar-app',
    name: 'Calendar',
    kind: 'app',
    icon: '📅',
    url: 'https://calendar.google.com',
    color: '#ef4444',
    status: 'Installiert',
    descriptionShort: 'Termine und Events verwalten',
    info: {
      format: 'html',
      content: `<h1>Google Calendar</h1>
<p><strong>Ihr digitaler Terminplaner</strong></p>
<p>Organisieren Sie Ihren Alltag mit dem weltweit führenden Kalenderdienst.</p>
<h2>Hauptfunktionen</h2>
<ul>
<li><strong>Terminplanung</strong> - Events erstellen und verwalten</li>
<li><strong>Erinnerungen</strong> - Nie wieder einen Termin vergessen</li>
<li><strong>Freigabe</strong> - Kalender mit Familie und Kollegen teilen</li>
<li><strong>Integration</strong> - Verbindung mit Gmail und anderen Google-Diensten</li>
<li><strong>Mobile Sync</strong> - Zugriff von überall</li>
</ul>
<p>Verfügbar auf allen Plattformen und Geräten.</p>`
    },
    pos: { x: 4, y: 0 },
    dim: { w: 1, h: 1 }
  },
  {
    id: 'github-app',
    name: 'GitHub',
    kind: 'app',
    icon: '💻',
    url: 'https://github.com',
    color: '#6b7280',
    status: 'Installiert',
    descriptionShort: 'Code-Repositories und Entwickler-Zusammenarbeit',
    info: {
      format: 'markdown',
      content: `# GitHub

**Die Entwicklerplattform**

GitHub ist die weltweit führende Plattform für Softwareentwicklung und Versionskontrolle.

## Was ist GitHub?
- **Git-Repositories** - Versionskontrolle für Code
- **Collaboration** - Teamarbeit an Projekten
- **Issue Tracking** - Bug-Reports und Feature-Requests
- **Pull Requests** - Code-Review-Prozess
- **Actions** - CI/CD-Pipelines
- **Packages** - Software-Pakete hosten

## Für wen?
- Einzelentwickler
- Open-Source-Projekte  
- Unternehmensteams
- Studenten und Lernende

Über 100 Millionen Entwickler nutzen GitHub weltweit.`
    },
    pos: { x: 5, y: 0 },
    dim: { w: 1, h: 1 }
  }
]);

// Widgets Store
export const widgets = writable([
  {
    id: 'welcome-widget',
    title: 'Willkommen bei LibreWorkspace',
    kind: 'widget',
    widgetType: 'markdown',
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
    pos: { x: 0, y: 1 },
    dim: { w: 2, h: 2 },
    visible: true,
    color: 'blue',
    props: {}
  },
  {
    id: 'productivity-stats',
    title: 'Produktivitäts-Übersicht',
    kind: 'widget',
    widgetType: 'html',
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
    pos: { x: 2, y: 1 },
    dim: { w: 2, h: 2 },
    visible: true,
    color: 'green',
    props: {}
  },
  {
    id: 'quick-notes',
    title: 'Schnelle Notizen',
    kind: 'widget',
    widgetType: 'markdown',
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
    pos: { x: 4, y: 1 },
    dim: { w: 2, h: 3 },
    visible: true,
    color: 'purple',
    props: {}
  },
  {
    id: 'system-info',
    title: 'System Status',
    kind: 'widget',
    widgetType: 'html',
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
    pos: { x: 0, y: 3 },
    dim: { w: 2, h: 2 },
    visible: true,
    color: 'orange',
    props: {}
  }
]);

// Dashboard Items Store (kombiniert Apps und Widgets)
export const dashboardItems = writable([]);

// Initialisiere Dashboard Items
apps.subscribe(appList => {
  widgets.subscribe(widgetList => {
    const allItems = [
      ...appList.map(app => ({ ...app, kind: 'app' })),
      ...widgetList.map(widget => ({ ...widget, kind: 'widget' }))
    ];
    dashboardItems.set(allItems);
  });
});

export function addApp(app) {
  const newApp = {
    ...app,
    id: crypto.randomUUID(),
    kind: 'app',
    status: 'Installiert',
    dim: { w: 1, h: 1 }
  };
  
  // Finde freien Platz
  dashboardItems.subscribe(items => {
    newApp.pos = findFreeSpot(items, newApp.dim);
  })();
  
  apps.update(a => [...a, newApp]);
}

export function deleteApp(id) {
  apps.update(a => a.filter(app => app.id !== id));
}

export function addWidget(widget) {
  const newWidget = {
    ...widget,
    id: crypto.randomUUID(),
    kind: 'widget',
    widgetType: widget.type || 'markdown',
    dim: normalizeDim({ kind: 'widget', dim: widget.dim || { w: 2, h: 2 } }),
    visible: true,
    color: widget.color || 'blue',
    props: widget.props || {}
  };
  
  // Finde freien Platz
  dashboardItems.subscribe(items => {
    newWidget.pos = findFreeSpot(items, newWidget.dim);
  })();
  
  widgets.update(w => [...w, newWidget]);
}

export function updateWidget(id, updates) {
  const normalizedUpdates = {
    ...updates,
    dim: updates.dim ? normalizeDim({ kind: 'widget', dim: updates.dim }) : undefined
  };
  
  widgets.update(w => 
    w.map(widget => 
      widget.id === id 
        ? { ...widget, ...normalizedUpdates }
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
        pos: findFreeSpot(w, widget.dim)
      };
      return [...w, duplicate];
    }
    return w;
  });
}

export function moveItem(id, pos) {
  apps.update(a => a.map(app => app.id === id ? { ...app, pos } : app));
  widgets.update(w => w.map(widget => widget.id === id ? { ...widget, pos } : widget));
}

export function resizeItem(id, dim) {
  // Nur Widgets können resized werden
  widgets.update(w => 
    w.map(widget => 
      widget.id === id 
        ? { ...widget, dim: normalizeDim({ kind: 'widget', dim }) }
        : widget
    )
  );
}

// Context Menu Store
export const contextMenu = writable({
  open: false,
  x: 0,
  y: 0,
  item: null
});