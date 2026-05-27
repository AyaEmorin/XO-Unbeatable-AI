import type { BoardState, CellValue } from '../types/game';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardState;
  winLine: number[] | null;
  winner: CellValue;
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

export function Board({ board, winLine, winner, isDisabled, onCellClick }: BoardProps) {
  const winSet = new Set(winLine ?? []);

  return (
    <div
      role="grid"
      aria-label="Tic-Tac-Toe board"
      className="board-grid w-full max-w-[min(400px,80vw)]"
      data-testid="board"
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isWinCell={winSet.has(index)}
          winner={winner}
          isDisabled={isDisabled}
          onClick={onCellClick}
        />
      ))}
    </div>
  );
}
