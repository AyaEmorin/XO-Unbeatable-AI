import { describe, it, expect } from 'vitest';
import {
  checkWinner,
  isDraw,
  getEmptyCells,
  createEmptyBoard,
  applyMove,
  WIN_LINES,
} from '../gameLogic';
import type { BoardState } from '../../types/game';

describe('checkWinner', () => {
  it('returns no winner on empty board', () => {
    const { winner, line } = checkWinner(createEmptyBoard());
    expect(winner).toBeNull();
    expect(line).toBeNull();
  });

  it('detects X winning on each of the 8 win lines', () => {
    for (const line of WIN_LINES) {
      const board = createEmptyBoard();
      const b = applyMove(applyMove(applyMove(board, line[0], 'X'), line[1], 'X'), line[2], 'X');
      const result = checkWinner(b);
      expect(result.winner).toBe('X');
      expect(result.line).toEqual(line);
    }
  });

  it('detects O winning on each of the 8 win lines', () => {
    for (const line of WIN_LINES) {
      const board = createEmptyBoard();
      const b = applyMove(applyMove(applyMove(board, line[0], 'O'), line[1], 'O'), line[2], 'O');
      const result = checkWinner(b);
      expect(result.winner).toBe('O');
      expect(result.line).toEqual(line);
    }
  });

  it('returns null when board has mixed but no winner', () => {
    // X O X / O X O / O X O — draw
    const b: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    const { winner } = checkWinner(b);
    expect(winner).toBeNull();
  });

  it('identifies first matching winner when multiple lines are filled', () => {
    // Constructing a board where X wins on row 0 and col 0
    const b: BoardState = ['X', 'X', 'X', 'X', 'O', 'O', 'X', 'O', 'O'];
    const { winner } = checkWinner(b);
    expect(winner).toBe('X');
  });
});

describe('isDraw', () => {
  it('returns false on empty board', () => {
    expect(isDraw(createEmptyBoard())).toBe(false);
  });

  it('returns false on partial board', () => {
    const b = applyMove(createEmptyBoard(), 0, 'X');
    expect(isDraw(b)).toBe(false);
  });

  it('returns true when all cells are filled', () => {
    const b: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(isDraw(b)).toBe(true);
  });

  it('returns true even when a winner exists and board is full', () => {
    // isDraw only checks if board is full — caller must check winner first
    const b: BoardState = ['X', 'X', 'X', 'O', 'O', 'X', 'O', 'X', 'O'];
    expect(isDraw(b)).toBe(true);
  });
});

describe('getEmptyCells', () => {
  it('returns all 9 indices on empty board', () => {
    expect(getEmptyCells(createEmptyBoard())).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('returns empty array on full board', () => {
    const b: BoardState = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    expect(getEmptyCells(b)).toEqual([]);
  });

  it('returns correct subset on partial board', () => {
    const b = applyMove(applyMove(createEmptyBoard(), 0, 'X'), 4, 'O');
    expect(getEmptyCells(b)).toEqual([1, 2, 3, 5, 6, 7, 8]);
  });
});

describe('applyMove', () => {
  it('places a value at the given index', () => {
    const board = createEmptyBoard();
    const next = applyMove(board, 4, 'X');
    expect(next[4]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const board = createEmptyBoard();
    applyMove(board, 0, 'X');
    expect(board[0]).toBeNull();
  });

  it('preserves all other cells', () => {
    const board = createEmptyBoard();
    const next = applyMove(board, 3, 'O');
    for (let i = 0; i < 9; i++) {
      if (i !== 3) expect(next[i]).toBeNull();
    }
  });
});

describe('createEmptyBoard', () => {
  it('creates a board of length 9 with all nulls', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((c) => c === null)).toBe(true);
  });

  it('creates independent boards each call', () => {
    const a = createEmptyBoard();
    const b = createEmptyBoard();
    a[0] = 'X';
    expect(b[0]).toBeNull();
  });
});
