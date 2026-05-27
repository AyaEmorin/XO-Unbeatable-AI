interface RestartButtonProps {
  onClick: () => void;
}

export function RestartButton({ onClick }: RestartButtonProps) {
  return (
    <button
      id="restart-button"
      type="button"
      aria-label="Restart the game and clear the board"
      className="restart-btn"
      onClick={onClick}
      data-testid="restart-button"
    >
      ↺ New Game
    </button>
  );
}
