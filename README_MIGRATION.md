# WebSuite - Bits UI Migration Guide

## 🎯 Übersicht

Dieses Projekt wurde erfolgreich von einem Custom CSS/Component System zu **Bits UI** migriert. Bits UI bietet eine moderne, accessible und konsistente Design-Sprache für Svelte-Anwendungen.

## 🚀 Setup & Installation

### Abhängigkeiten
```bash
npm install bits-ui lucide-svelte clsx tailwind-variants @tailwindcss/typography
```

### Tailwind Konfiguration
Die `tailwind.config.js` wurde für Bits UI optimiert:
- CSS Custom Properties für Theme-Support
- Erweiterte Farbpalette mit HSL-Werten
- Responsive Container-Klassen
- Typography-Plugin Integration

### Theme-System
Das neue Theme-System nutzt CSS Custom Properties:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... weitere Tokens */
}
```

## 🎨 Design-Tokens

### Farbsystem
| Token | Verwendung | Beispiel |
|-------|------------|----------|
| `background` | Haupt-Hintergrund | `bg-background` |
| `foreground` | Haupt-Text | `text-foreground` |
| `primary` | Akzent-Elemente | `bg-primary` |
| `muted` | Sekundäre Bereiche | `bg-muted` |
| `border` | Rahmen | `border-border` |

### Spacing-Skala
Konsistente 8px-Grid-Basis:
- `p-2` = 8px
- `p-4` = 16px  
- `p-6` = 24px
- `p-8` = 32px

### Border-Radius
- `rounded-sm` = 4px
- `rounded-md` = 6px (Standard)
- `rounded-lg` = 8px
- `rounded-xl` = 12px

## 🧩 Komponenten-Bibliothek

### Button
```svelte
<Button variant="default" size="md">Standard</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
```

**Varianten:**
- `default` - Primärer Button
- `outline` - Button mit Rahmen
- `ghost` - Transparenter Button
- `destructive` - Für kritische Aktionen
- `link` - Link-Style

**Größen:**
- `sm` - Klein (32px)
- `default` - Standard (36px)
- `lg` - Groß (40px)
- `icon` - Quadratisch (36x36px)

### Card
```svelte
<Card class="p-6">
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>
```

### Tabs
```svelte
<Tabs value="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Dialog
```svelte
<Dialog bind:open={isOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content...</p>
  </DialogContent>
</Dialog>
```

### Form Controls
```svelte
<Input placeholder="Enter text..." bind:value={text} />
<Textarea placeholder="Enter description..." bind:value={description} />
```

### Badge
```svelte
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## 🎯 Accessibility Features

### Keyboard Navigation
- **Tab**: Navigation zwischen Elementen
- **Enter/Space**: Aktivierung von Buttons
- **Escape**: Schließen von Dialogs
- **Arrow Keys**: Navigation in Tabs/Menus

### Screen Reader Support
- Semantic HTML-Struktur
- ARIA-Labels und -Descriptions
- Proper heading hierarchy
- Focus-Management in Modals

### Visual Accessibility
- Ausreichende Kontrastverhältnisse (WCAG AA)
- Sichtbare Focus-Rings
- Hover-States für alle interaktiven Elemente
- Dark/Light Mode Support

## 🌙 Theme-System

### Theme-Wechsel
```javascript
import { setTheme } from '$lib/stores/settings';

// Theme wechseln
setTheme('dark'); // oder 'light'
```

### Akzentfarben
```javascript
import { setAccentColor } from '$lib/stores/settings';

// Akzentfarbe ändern
setAccentColor('blue'); // blue, green, purple, orange, red
```

### Custom Properties
Themes werden über CSS Custom Properties gesteuert:
```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 📁 Dateistruktur

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/           # Bits UI Wrapper
│   │   │   ├── button.svelte
│   │   │   ├── card.svelte
│   │   │   ├── dialog.svelte
│   │   │   ├── input.svelte
│   │   │   ├── tabs.svelte
│   │   │   └── index.ts
│   │   ├── Dashboard.svelte
│   │   ├── KanbanBoard.svelte
│   │   └── PomodoroTimer.svelte
│   └── stores/           # Svelte Stores (unverändert)
├── routes/
│   └── +page.svelte      # Hauptseite
└── app.html              # HTML Template mit CSS Tokens
```

## 🔧 Migration-Patterns

### Alte Button → Neue Button
```svelte
<!-- Alt -->
<button class="custom-btn primary" on:click={handler}>
  Click me
</button>

<!-- Neu -->
<Button variant="default" on:click={handler}>
  Click me
</Button>
```

### Alte Card → Neue Card
```svelte
<!-- Alt -->
<div class="custom-card">
  <div class="card-content">Content</div>
</div>

<!-- Neu -->
<Card class="p-4">
  Content
</Card>
```

### Alte Modal → Neue Dialog
```svelte
<!-- Alt -->
{#if showModal}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content">Content</div>
  </div>
{/if}

<!-- Neu -->
<Dialog bind:open={showModal}>
  <DialogContent>Content</DialogContent>
</Dialog>
```

## ✅ Do's & Don'ts

### ✅ Do's
- Nutze Bits UI Komponenten für alle UI-Elemente
- Verwende Tailwind-Klassen für Styling
- Halte dich an die Design-Token-Skala
- Teste Keyboard-Navigation
- Prüfe Accessibility mit Screen Reader

### ❌ Don'ts
- Keine Custom CSS für UI-Komponenten
- Keine Inline-Styles verwenden
- Nicht von Design-Token-Skala abweichen
- Keine manuellen Focus-Management
- Keine Custom Modal-Implementierungen

## 🐛 Troubleshooting

### Theme wird nicht angewendet
```javascript
// Stelle sicher, dass Theme-Klassen gesetzt werden
$: if (typeof document !== 'undefined') {
  document.documentElement.classList.toggle('dark', $settings.theme === 'dark');
}
```

### Komponenten werden nicht gefunden
```javascript
// Prüfe Imports
import { Button, Card } from '$lib/components/ui';
```

### Styling funktioniert nicht
```javascript
// Stelle sicher, dass Tailwind CSS korrekt konfiguriert ist
// und alle Bits UI Klassen in der Purge-Liste stehen
```

## 📚 Weitere Ressourcen

- [Bits UI Dokumentation](https://bits-ui.com/docs)
- [Tailwind CSS Dokumentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎉 Migration abgeschlossen!

Das Projekt nutzt jetzt ein modernes, konsistentes und accessible Design-System. Alle Komponenten folgen den Bits UI Standards und bieten eine hervorragende Developer- und User-Experience.