// src/lib/stores/kanban.js
import { writable } from 'svelte/store';

export const kanbanBoards = writable([
  {
    id: 'board-1',
    title: 'Projekt Management',
    viewMode: 'kanban', // 'kanban', 'list', 'gantt'
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        cards: [
          { 
            id: 'card-1', 
            title: 'Website Design', 
            description: 'Neues Layout erstellen',
            priority: 'high',
            assignee: 'Max Mustermann',
            dueDate: '2025-01-20',
            startDate: '2025-01-15',
            status: 'To Do',
            tags: ['Design', 'Frontend']
          },
          { 
            id: 'card-2', 
            title: 'API Integration', 
            description: 'Backend anbinden',
            priority: 'medium',
            assignee: 'Anna Schmidt',
            dueDate: '2025-01-25',
            startDate: '2025-01-18',
            status: 'To Do',
            tags: ['Backend', 'API']
          }
        ]
      },
      {
        id: 'col-2',
        title: 'In Progress',
        cards: [
          { 
            id: 'card-3', 
            title: 'Dashboard entwickeln', 
            description: 'Kanban Board implementieren',
            priority: 'high',
            assignee: 'Tom Weber',
            dueDate: '2025-01-22',
            startDate: '2025-01-16',
            status: 'In Progress',
            tags: ['Frontend', 'Dashboard']
          }
        ]
      },
      {
        id: 'col-3',
        title: 'Done',
        cards: [
          { 
            id: 'card-4', 
            title: 'Setup Projekt', 
            description: 'Grundstruktur erstellt',
            priority: 'low',
            assignee: 'Lisa Müller',
            dueDate: '2025-01-14',
            startDate: '2025-01-10',
            status: 'Done',
            tags: ['Setup', 'Infrastructure']
          }
        ]
      }
    ]
  }
]);

export const activeBoard = writable('board-1');

export function setBoardViewMode(boardId, viewMode) {
  kanbanBoards.update(boards => 
    boards.map(board => 
      board.id === boardId 
        ? { ...board, viewMode }
        : board
    )
  );
}

export function addCard(boardId, columnId, card) {
  kanbanBoards.update(boards => 
    boards.map(board => 
      board.id === boardId 
        ? {
            ...board,
            columns: board.columns.map(col => 
              col.id === columnId 
                ? { 
                    ...col, 
                    cards: [...col.cards, { 
                      ...card, 
                      id: crypto.randomUUID(),
                      status: col.title,
                      priority: card.priority || 'medium',
                      assignee: card.assignee || '',
                      dueDate: card.dueDate || '',
                      startDate: card.startDate || '',
                      tags: card.tags || []
                    }] 
                  }
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

export function completeTask(boardId, cardId) {
  kanbanBoards.update(boards => {
    const board = boards.find(b => b.id === boardId);
    if (!board) return boards;
    
    // Finde die Karte und ihre aktuelle Spalte
    let sourceColumn = null;
    let taskCard = null;
    
    for (const column of board.columns) {
      const card = column.cards.find(c => c.id === cardId);
      if (card) {
        sourceColumn = column;
        taskCard = card;
        break;
      }
    }
    
    if (!sourceColumn || !taskCard) return boards;
    
    // Finde die "Done" Spalte (oder die letzte Spalte)
    const doneColumn = board.columns.find(col => 
      col.title.toLowerCase().includes('done') || 
      col.title.toLowerCase().includes('fertig') ||
      col.title.toLowerCase().includes('erledigt')
    ) || board.columns[board.columns.length - 1];
    
    // Wenn die Karte bereits in der Done-Spalte ist, nichts tun
    if (sourceColumn.id === doneColumn.id) return boards;
    
    return boards.map(b => 
      b.id === boardId 
        ? {
            ...b,
            columns: b.columns.map(col => {
              if (col.id === sourceColumn.id) {
                // Karte aus der Quell-Spalte entfernen
                return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
              }
              if (col.id === doneColumn.id) {
                // Karte zur Done-Spalte hinzufügen
                return { ...col, cards: [...col.cards, taskCard] };
              }
              return col;
            })
          }
        : b
    );
  });
}