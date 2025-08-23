// src/lib/stores/kanban.js
import { writable } from 'svelte/store';

export const kanbanBoards = writable([
  {
    id: 'board-1',
    title: 'Projekt Management',
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Website Design', description: 'Neues Layout erstellen' },
          { id: 'card-2', title: 'API Integration', description: 'Backend anbinden' }
        ]
      },
      {
        id: 'col-2',
        title: 'In Progress',
        cards: [
          { id: 'card-3', title: 'Dashboard entwickeln', description: 'Kanban Board implementieren' }
        ]
      },
      {
        id: 'col-3',
        title: 'Done',
        cards: [
          { id: 'card-4', title: 'Setup Projekt', description: 'Grundstruktur erstellt' }
        ]
      }
    ]
  }
]);

export const activeBoard = writable('board-1');

export function addCard(boardId, columnId, card) {
  kanbanBoards.update(boards => 
    boards.map(board => 
      board.id === boardId 
        ? {
            ...board,
            columns: board.columns.map(col => 
              col.id === columnId 
                ? { ...col, cards: [...col.cards, { ...card, id: crypto.randomUUID() }] }
                : col
            )
          }
        : board
    )
  );
}

export function moveCard(boardId, fromColumnId, toColumnId, cardId) {
  kanbanBoards.update(boards => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return boards;
    
    const fromColumn = board.columns.find(c => c.id === fromColumnId);
    const toColumn = board.columns.find(c => c.id === toColumnId);
    const card = fromColumn?.cards.find(c => c.id === cardId);
    
    if (!card || !fromColumn || !toColumn) return boards;
    
    return boards.map(b => 
      b.id === boardId 
        ? {
            ...b,
            columns: b.columns.map(col => {
              if (col.id === fromColumnId) {
                return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
              }
              if (col.id === toColumnId) {
                return { ...col, cards: [...col.cards, card] };
              }
              return col;
            })
          }
        : b
    );
  });
}

export function deleteCard(boardId, columnId, cardId) {
  kanbanBoards.update(boards => 
    boards.map(board => 
      board.id === boardId 
        ? {
            ...board,
            columns: board.columns.map(col => 
              col.id === columnId 
                ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
                : col
            )
          }
        : board
    )
  );
}