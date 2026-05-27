import type { ScoreRecord } from '../types/game';

interface ScoreBoardProps {
  score: ScoreRecord;
}

interface ScoreTile {
  label: string;
  value: number;
  colorClass: string;
  badgeVariant: string;
  id: string;
}

export function ScoreBoard({ score }: ScoreBoardProps) {
  const tiles: ScoreTile[] = [
    {
      id: 'score-wins',
      label: 'Wins',
      value: score.wins,
      colorClass: 'text-[#00f5d4]',
      badgeVariant: 'score-badge--win',
    },
    {
      id: 'score-draws',
      label: 'Draws',
      value: score.draws,
      colorClass: 'text-indigo-400',
      badgeVariant: 'score-badge--draw',
    },
    {
      id: 'score-losses',
      label: 'Losses',
      value: score.losses,
      colorClass: 'text-[#f72585]',
      badgeVariant: 'score-badge--loss',
    },
  ];

  return (
    <div
      role="region"
      aria-label="Score tracker"
      className="grid grid-cols-3 gap-3 w-full"
      data-testid="scoreboard"
    >
      {tiles.map(({ id, label, value, colorClass, badgeVariant }) => (
        <div
          key={id}
          id={id}
          className={`score-badge ${badgeVariant}`}
          aria-label={`${label}: ${value}`}
          data-testid={id}
        >
          <div className={`text-2xl font-black ${colorClass}`}>{value}</div>
          <div className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
