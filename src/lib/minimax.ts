import type { BoardState } from '../types/game';
import { checkWinner, getEmptyCells, applyMove } from './gameLogic';

// AI is always 'O', Player is always 'X'
const AI = 'O';
const PLAYER = 'X';

interface MinimaxResult {
  score: number;
  trapScore: number;
}

// Cache for memoization (transposition table)
const memo = new Map<string, MinimaxResult>();

/**
 * Returns a unique string key for the current board state and turn.
 */
function getBoardKey(board: BoardState, isMaximizing: boolean): string {
  let key = '';
  for (let i = 0; i < 9; i++) {
    key += board[i] || '-';
  }
  return key + (isMaximizing ? '1' : '0');
}

/**
 * Minimax algorithm with Memoization and Trap-Setting (Complexity Heuristics).
 *
 * Scores are depth-adjusted so the AI:
 *  - Wins as quickly as possible  (+10 - depth)
 *  - Loses as slowly as possible  (depth - 10)
 *  - Draws at 0
 *
 * Trap Score (trapScore) counts the total sum of terminal states in a branch.
 * A higher trap score means more branches lead to AI wins, acting as a "trap"
 * if the opponent plays randomly or makes a mistake.
 *
 * @param board   Current board state
 * @param depth   Current recursion depth
 * @param isMaximizing  true when it's AI's turn
 * @returns       MinimaxResult containing the best score and the trap score
 */
export function minimaxFull(
  board: BoardState,
  depth: number,
  isMaximizing: boolean
): MinimaxResult {
  const key = getBoardKey(board, isMaximizing);
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const { winner } = checkWinner(board);
  const absoluteDepth = 9 - getEmptyCells(board).length;

  // Terminal states
  if (winner === AI) {
    const res = { score: 10 - absoluteDepth, trapScore: 10 - absoluteDepth };
    memo.set(key, res);
    return res;
  }
  if (winner === PLAYER) {
    const res = { score: absoluteDepth - 10, trapScore: absoluteDepth - 10 };
    memo.set(key, res);
    return res;
  }

  const empty = getEmptyCells(board);
  if (empty.length === 0) {
    const res = { score: 0, trapScore: 0 };
    memo.set(key, res);
    return res;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    let totalTrapScore = 0;
    for (const idx of empty) {
      const next = applyMove(board, idx, AI);
      const result = minimaxFull(next, depth + 1, false);
      bestScore = Math.max(bestScore, result.score);
      totalTrapScore += result.trapScore;
    }
    const res = { score: bestScore, trapScore: totalTrapScore };
    memo.set(key, res);
    return res;
  } else {
    let bestScore = Infinity;
    let totalTrapScore = 0;
    for (const idx of empty) {
      const next = applyMove(board, idx, PLAYER);
      const result = minimaxFull(next, depth + 1, true);
      bestScore = Math.min(bestScore, result.score);
      totalTrapScore += result.trapScore;
    }
    const res = { score: bestScore, trapScore: totalTrapScore };
    memo.set(key, res);
    return res;
  }
}

/**
 * Backwards compatible signature for tests that expect a number.
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  _alpha: number = -Infinity,
  _beta: number = Infinity
): number {
  return minimaxFull(board, depth, isMaximizing).score;
}

/**
 * Returns the optimal board index for the AI to play (Hard mode).
 * If multiple moves share the same Minimax score, it breaks ties using the
 * trapScore (maximizing opponent mistakes). If still tied, it randomizes the choice.
 *
 * @param board Current board state (AI must have at least one empty cell)
 * @returns     Index (0–8) of the best move
 */
export function getBestMove(board: BoardState): number {
  const empty = getEmptyCells(board);
  if (empty.length === 0) throw new Error('No moves available');

  let bestScore = -Infinity;
  let bestTrap = -Infinity;
  let bestMoves: number[] = [];

  for (const idx of empty) {
    const next = applyMove(board, idx, AI);
    const result = minimaxFull(next, 0, false);
    
    if (result.score > bestScore) {
      bestScore = result.score;
      bestTrap = result.trapScore;
      bestMoves = [idx];
    } else if (result.score === bestScore) {
      if (result.trapScore > bestTrap) {
        bestTrap = result.trapScore;
        bestMoves = [idx];
      } else if (result.trapScore === bestTrap) {
        bestMoves.push(idx);
      }
    }
  }

  // Randomize among equally optimal and equal-trap moves
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/**
 * Returns a random empty cell index (Easy mode).
 *
 * @param board Current board state
 * @returns     A random index from the empty cells
 */
export function getRandomMove(board: BoardState): number {
  const empty = getEmptyCells(board);
  if (empty.length === 0) throw new Error('No moves available');
  return empty[Math.floor(Math.random() * empty.length)];
}
