import type { BoardState } from '../types/game';
import { checkWinner, getEmptyCells, applyMove } from './gameLogic';

// AI is always 'O', Player is always 'X'
const AI: 'O' = 'O';
const PLAYER: 'X' = 'X';

/**
 * Minimax algorithm with Alpha-Beta Pruning.
 *
 * Scores are depth-adjusted so the AI:
 *  - Wins as quickly as possible  (+10 - depth)
 *  - Loses as slowly as possible  (depth - 10)
 *  - Draws at 0
 *
 * @param board   Current board state
 * @param depth   Current recursion depth
 * @param isMaximizing  true when it's AI's turn
 * @param alpha   Best score maximizer can guarantee so far
 * @param beta    Best score minimizer can guarantee so far
 * @returns       Heuristic score of the board position
 */
export function minimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
): number {
  const { winner } = checkWinner(board);

  // Terminal states
  if (winner === AI) return 10 - depth;
  if (winner === PLAYER) return depth - 10;

  const empty = getEmptyCells(board);
  if (empty.length === 0) return 0; // draw

  if (isMaximizing) {
    let best = -Infinity;
    for (const idx of empty) {
      const next = applyMove(board, idx, AI);
      const score = minimax(next, depth + 1, false, alpha, beta);
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Beta cut-off
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of empty) {
      const next = applyMove(board, idx, PLAYER);
      const score = minimax(next, depth + 1, true, alpha, beta);
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return best;
  }
}

/**
 * Positional preference weights.
 * Center > Corners > Edges — used as tie-breaker when Minimax scores are equal.
 */
const POSITION_PREFERENCE = [3, 1, 3, 1, 5, 1, 3, 1, 3] as const;

/**
 * Returns the optimal board index for the AI to play (Hard mode).
 * When multiple moves share the same Minimax score, the positional
 * preference (center > corners > edges) breaks ties — this guarantees
 * the AI opens with center on an empty board, matching optimal play.
 *
 * @param board Current board state (AI must have at least one empty cell)
 * @returns     Index (0–8) of the best move
 */
export function getBestMove(board: BoardState): number {
  const empty = getEmptyCells(board);
  if (empty.length === 0) throw new Error('No moves available');

  let bestScore = -Infinity;
  let bestPreference = -1;
  let bestMove = empty[0];

  for (const idx of empty) {
    const next = applyMove(board, idx, AI);
    const score = minimax(next, 0, false, -Infinity, Infinity);
    const preference = POSITION_PREFERENCE[idx];
    // Prefer higher score; break ties by positional preference
    if (score > bestScore || (score === bestScore && preference > bestPreference)) {
      bestScore = score;
      bestPreference = preference;
      bestMove = idx;
    }
  }

  return bestMove;
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
