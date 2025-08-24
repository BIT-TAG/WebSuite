// src/lib/stores/windows.js
import { writable } from 'svelte/store';

export const windows = writable([]);

export const minimizedWindows = writable([]);
export function openWindow({ title, iframeSrc, content }) {
  windows.update((ws) => [
    ...ws,
    {
      id: crypto.randomUUID(),
      title,
      position: { x: 100 + ws.length * 20, y: 100 + ws.length * 20 },
      width: 320,
      height: 240,
      isMaximized: false,
      originalPosition: null,
      originalSize: null,
      zIndex: Date.now(),
      iframeSrc,
      content,
    }
  ]);
}

export function closeWindow(id) {
  windows.update((ws) => ws.filter((w) => w.id !== id));
}

export function minimizeWindow(id) {
  windows.update((ws) => {
    const window = ws.find(w => w.id === id);
    if (window) {
      minimizedWindows.update(mw => [...mw, window]);
      return ws.filter(w => w.id !== id);
    }
    return ws;
  });
}

export function restoreWindow(id) {
  minimizedWindows.update((mw) => {
    const window = mw.find(w => w.id === id);
    if (window) {
      windows.update(ws => [...ws, { ...window, zIndex: Date.now() }]);
      return mw.filter(w => w.id !== id);
    }
    return mw;
  });
}

export function maximizeWindow(id) {
  windows.update((ws) =>
    ws.map((w) => w.id === id ? { 
      ...w, 
      isMaximized: !w.isMaximized,
      originalPosition: w.isMaximized ? w.originalPosition : w.position,
      originalSize: w.isMaximized ? w.originalSize : { width: w.width || 320, height: w.height || 240 },
      position: w.isMaximized ? w.originalPosition : { x: 0, y: 0 },
      width: w.isMaximized ? w.originalSize?.width : window.innerWidth,
      height: w.isMaximized ? w.originalSize?.height : window.innerHeight - 80
    } : w)
  );
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

export function resizeWindow(id, width, height) {
  windows.update((ws) =>
    ws.map((w) => w.id === id ? { ...w, width, height } : w)
  );
}