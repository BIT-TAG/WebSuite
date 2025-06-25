// src/lib/stores/windows.js
import { writable } from 'svelte/store';

export const windows = writable([]);

export function openWindow({ title, iframeSrc, content }) {
  windows.update((ws) => [
    ...ws,
    {
      id: crypto.randomUUID(),
      title,
      position: { x: 100 + ws.length * 20, y: 100 + ws.length * 20 },
      zIndex: Date.now(),
      iframeSrc,
      content,
    }
  ]);
}

export function closeWindow(id) {
  windows.update((ws) => ws.filter((w) => w.id !== id));
}

export function bringToFront(id) {
  windows.update((ws) => {
    const z = Date.now();
    return ws.map(w => w.id === id ? { ...w, zIndex: z } : w);
  });
}

export function moveWindow(id, position) {
  windows.update((ws) =>
    ws.map((w) => w.id === id ? { ...w, position } : w)
  );
}
