import type { Difficulty } from '../types/game';

interface DifficultyToggleProps {
  difficulty: Difficulty;
  onChange: (d: Difficulty) => void;
}

export function DifficultyToggle({ difficulty, onChange }: DifficultyToggleProps) {
  return (
    <div
      role="group"
      aria-label="Difficulty setting"
      className="diff-toggle"
      data-testid="difficulty-toggle"
    >
      <button
        id="difficulty-easy"
        type="button"
        role="radio"
        aria-checked={difficulty === 'easy'}
        aria-label="Easy difficulty — AI plays randomly"
        className={`diff-toggle__option ${difficulty === 'easy' ? 'diff-toggle__option--active' : ''}`}
        onClick={() => onChange('easy')}
        data-testid="difficulty-easy"
      >
        Easy
      </button>
      <button
        id="difficulty-hard"
        type="button"
        role="radio"
        aria-checked={difficulty === 'hard'}
        aria-label="Hard difficulty — AI is unbeatable"
        className={`diff-toggle__option ${difficulty === 'hard' ? 'diff-toggle__option--active' : ''}`}
        onClick={() => onChange('hard')}
        data-testid="difficulty-hard"
      >
        Hard
      </button>
    </div>
  );
}
