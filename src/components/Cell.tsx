import type { CellValue } from '../types/game';

interface CellProps {
  value: CellValue;
  index: number;
  isWinCell: boolean;
  winner: CellValue;
  isDisabled: boolean;
  onClick: (index: number) => void;
}

// Human-readable cell position labels for accessibility
const POSITION_LABELS = [
  'top-left', 'top-center', 'top-right',
  'middle-left', 'center', 'middle-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

export function Cell({ value, index, isWinCell, winner, isDisabled, onClick }: CellProps) {
  const isEmpty = value === null;

  const handleClick = () => {
    if (!isDisabled && isEmpty) onClick(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Build CSS class string
  const cellClasses = [
    'cell',
    value ? 'cell--filled' : '',
    isDisabled ? 'cell--disabled' : '',
    isWinCell ? 'cell--win' : '',
    isWinCell && winner === 'X' ? 'cell--win-x' : '',
    isWinCell && winner === 'O' ? 'cell--win-o' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const symbolClasses = [
    'cell__symbol',
    value === 'X' ? 'cell__symbol--x' : '',
    value === 'O' ? 'cell__symbol--o' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const label = value
    ? `${value} in ${POSITION_LABELS[index]}`
    : `Empty ${POSITION_LABELS[index]} — click to play`;

  return (
    <div
      id={`cell-${index}`}
      role="button"
      tabIndex={isEmpty && !isDisabled ? 0 : -1}
      aria-label={label}
      aria-pressed={!isEmpty}
      aria-disabled={isDisabled || !isEmpty}
      className={cellClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid={`cell-${index}`}
    >
      {value && (
        <span className={symbolClasses} aria-hidden="true">
          {value === 'X' ? '✕' : '○'}
        </span>
      )}
    </div>
  );
}
