import { useState, useCallback, useEffect, useRef } from 'react';
import type { BoardState, Difficulty, GameStatus, ScoreRecord } from '../types/game';
import { checkWinner, isDraw, createEmptyBoard, applyMove } from '../lib/gameLogic';
import { getBestMove, getRandomMove } from '../lib/minimax';

const SCORE_KEY = 'xo-score';

function loadScore(): ScoreRecord {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (
        parsed &&
        typeof parsed === 'object' &&
        'wins' in parsed &&
        'draws' in parsed &&
        'losses' in parsed
      ) {
        return parsed as ScoreRecord;
      }
    }
  } catch {
    // ignore parse errors
  }
  return { wins: 0, draws: 0, losses: 0 };
}

function saveScore(score: ScoreRecord): void {
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score));
  } catch {
    // ignore write errors (e.g., private browsing)
  }
}

interface UseGameReturn {
  board: BoardState;
  status: GameStatus;
  winLine: number[] | null;
  difficulty: Difficulty;
  score: ScoreRecord;
  handleCellClick: (index: number) => void;
  resetGame: () => void;
  setDifficulty: (d: Difficulty) => void;
}

export function useGame(): UseGameReturn {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard);
  const [status, setStatus] = useState<GameStatus>('player-turn');
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [difficulty, setDifficultyState] = useState<Difficulty>('hard');
  const [score, setScore] = useState<ScoreRecord>(loadScore);

  // Ref always holds the latest board without causing re-renders or dep-array issues.
  // Used to read board state synchronously inside the AI useEffect without putting
  // `board` in the dependency array (which would cause unnecessary re-triggers).
  const boardRef = useRef<BoardState>(board);
  boardRef.current = board;

  // Persist score on every change
  useEffect(() => {
    saveScore(score);
  }, [score]);

  /** Finalize a board state: check for win/draw and update status + score */
  const finalize = useCallback(
    (nextBoard: BoardState, justPlayed: 'X' | 'O') => {
      const result = checkWinner(nextBoard);
      if (result.winner) {
        setWinLine(result.line);
        if (result.winner === 'X') {
          setStatus('player-win');
          setScore((s) => ({ ...s, wins: s.wins + 1 }));
        } else {
          setStatus('ai-win');
          setScore((s) => ({ ...s, losses: s.losses + 1 }));
        }
        return true; // game ended
      }
      if (isDraw(nextBoard)) {
        setStatus('draw');
        setScore((s) => ({ ...s, draws: s.draws + 1 }));
        return true;
      }
      // Continue — switch turn
      if (justPlayed === 'X') {
        setStatus('ai-thinking');
      } else {
        setStatus('player-turn');
      }
      return false;
    },
    [],
  );

  /** AI move effect: fires when status becomes 'ai-thinking' */
  useEffect(() => {
    if (status !== 'ai-thinking') return;

    // Small delay for UX — makes AI feel "natural"
    const timer = setTimeout(() => {
      // ─────────────────────────────────────────────────────────────────
      // BUG FIX: Previously `finalize` was called INSIDE the setBoard
      // updater function. React StrictMode (development only) intentionally
      // calls state updater functions TWICE to detect impure updaters.
      // Since `finalize` has side effects (setScore, setStatus), this caused
      // the score to increment by 2 instead of 1 on every AI win/draw.
      //
      // Fix: compute the next board OUTSIDE the setBoard updater using the
      // boardRef (so we always read the latest board without stale closures),
      // then call setBoard with the plain value and call finalize once,
      // separately. State updater functions must be pure — no side effects.
      // ─────────────────────────────────────────────────────────────────
      const currentBoard = boardRef.current;
      const move =
        difficulty === 'hard'
          ? getBestMove(currentBoard)
          : getRandomMove(currentBoard);

      const nextBoard = applyMove(currentBoard, move, 'O');

      // Set board with a plain value (not an updater) — no double-invocation.
      setBoard(nextBoard);
      // Call finalize once, outside the updater — side effects are safe here.
      finalize(nextBoard, 'O');
    }, 300);

    return () => clearTimeout(timer);
  }, [status, difficulty, finalize]);

  const handleCellClick = useCallback(
    (index: number) => {
      if (status !== 'player-turn') return;
      if (board[index] !== null) return;

      const nextBoard = applyMove(board, index, 'X');
      setBoard(nextBoard);
      finalize(nextBoard, 'X');
    },
    [board, status, finalize],
  );

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setWinLine(null);
    setStatus('player-turn');
  }, []);

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficultyState(d);
      // Reset board when difficulty changes
      setBoard(createEmptyBoard());
      setWinLine(null);
      setStatus('player-turn');
    },
    [],
  );

  return {
    board,
    status,
    winLine,
    difficulty,
    score,
    handleCellClick,
    resetGame,
    setDifficulty,
  };
}
