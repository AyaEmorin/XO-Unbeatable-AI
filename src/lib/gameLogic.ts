import type { BoardState, WinResult } from '../types/game';

/** All winning line combinations on a 3×3 board */
export const WIN_LINES: number[][] = [
  [0, 1, 2], // row 0
  [3, 4, 5], // row 1
  [6, 7, 8], // row 2
  [0, 3, 6], // col 0
  [1, 4, 7], // col 1
  [2, 5, 8], // col 2
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
];

/**
 * Check if there is a winner on the board.
 * Returns the winner ('X' or 'O') and the winning line indices,
 * or { winner: null, line: null } if no winner.
 */
export function checkWinner(board: BoardState): WinResult {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * Returns true if the board is completely filled (all 9 cells non-null).
 * Does NOT check for a winner — call checkWinner first.
 */
export function isDraw(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Returns the indices of all empty cells on the board.
 */
export function getEmptyCells(board: BoardState): number[] {
  return board.reduce<number[]>((acc, cell, idx) => {
    if (cell === null) acc.push(idx);
    return acc;
  }, []);
}

/**
 * Returns a fresh empty board.
 */
export function createEmptyBoard(): BoardState {
  return Array(9).fill(null) as BoardState;
}

/**
 * Returns a new board with the given move applied (immutable).
 */
export function applyMove(board: BoardState, index: number, player: 'X' | 'O'): BoardState {
  const next = [...board] as BoardState;
  next[index] = player;
  return next;
}
