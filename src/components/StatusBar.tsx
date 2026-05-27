import type { GameStatus } from '../types/game';

interface StatusBarProps {
  status: GameStatus;
}

const STATUS_CONFIG: Record<GameStatus, { text: string; emoji: string; colorClass: string }> = {
  idle:         { text: 'Ready to play!',  emoji: '🎮', colorClass: 'text-slate-400' },
  playing:      { text: 'Game in progress', emoji: '▶️', colorClass: 'text-slate-400' },
  'player-turn':{ text: 'Your turn',        emoji: '✕',  colorClass: 'text-[#00f5d4]' },
  'ai-thinking':{ text: 'AI is thinking…',  emoji: '○',  colorClass: 'text-[#f72585]' },
  'player-win': { text: 'You won!',          emoji: '🏆', colorClass: 'text-[#00f5d4]' },
  'ai-win':     { text: 'AI wins!',          emoji: '🤖', colorClass: 'text-[#f72585]' },
  draw:         { text: 'You drew!',         emoji: '🤝', colorClass: 'text-indigo-400' },
};

export function StatusBar({ status }: StatusBarProps) {
  const { text, emoji, colorClass } = STATUS_CONFIG[status];
  const isThinking = status === 'ai-thinking';
  const isGameEnd = ['player-win', 'ai-win', 'draw'].includes(status);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Game status: ${text}`}
      className="status-bar flex items-center justify-center gap-2 py-2"
      data-testid="status-bar"
      key={status} // re-mount to retrigger animation on status change
    >
      <span
        aria-hidden="true"
        className={`text-xl ${isThinking ? 'animate-spin' : isGameEnd ? 'animate-bounce-in' : ''}`}
        style={{ display: 'inline-block' }}
      >
        {emoji}
      </span>
      <span
        className={`font-semibold text-lg tracking-wide ${colorClass}`}
        style={{ animation: 'slide-up 0.3s ease both' }}
      >
        {text}
      </span>
    </div>
  );
}
