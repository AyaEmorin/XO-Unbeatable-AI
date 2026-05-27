// Game types for XO Tic-Tac-Toe

export type CellValue = 'X' | 'O' | null;
export type BoardState = CellValue[]; // length 9, indices 0-8
export type Difficulty = 'easy' | 'hard';
export type GameStatus =
  | 'idle'
  | 'playing'
  | 'player-turn'
  | 'ai-thinking'
  | 'player-win'
  | 'ai-win'
  | 'draw';

export interface WinResult {
  winner: CellValue;
  line: number[] | null;
}

export interface ScoreRecord {
  wins: number;
  draws: number;
  losses: number;
}

export interface GameState {
  board: BoardState;
  status: GameStatus;
  winLine: number[] | null;
  difficulty: Difficulty;
  score: ScoreRecord;
}
