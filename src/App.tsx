import './index.css';
import { useGame } from './hooks/useGame';
import { Board } from './components/Board';
import { StatusBar } from './components/StatusBar';
import { ScoreBoard } from './components/ScoreBoard';
import { DifficultyToggle } from './components/DifficultyToggle';
import { RestartButton } from './components/RestartButton';
import { checkWinner } from './lib/gameLogic';

function App() {
  const { board, status, winLine, difficulty, score, handleCellClick, resetGame, setDifficulty } =
    useGame();

  const isBoardDisabled = status !== 'player-turn';
  const winResult = checkWinner(board);

  return (
    <>
      {/* Background orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-8 gap-6"
        aria-label="Tic-Tac-Toe game"
      >
        {/* Header */}
        <header className="text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-[#00f5d4] via-indigo-400 to-[#f72585] bg-clip-text text-transparent">
            XO
          </h1>
          <p className="text-slate-500 text-sm mt-1 tracking-widest uppercase font-medium">
            Tic · Tac · Toe
          </p>
        </header>

        {/* Main card */}
        <div className="glass-card w-full max-w-sm p-6 flex flex-col items-center gap-5 animate-slide-up">

          {/* Difficulty + Restart row */}
          <div className="flex items-center justify-between w-full">
            <DifficultyToggle difficulty={difficulty} onChange={setDifficulty} />
            <RestartButton onClick={resetGame} />
          </div>

          {/* Status */}
          <StatusBar status={status} key={status} />

          {/* Board */}
          <Board
            board={board}
            winLine={winLine}
            winner={winResult.winner}
            isDisabled={isBoardDisabled}
            onCellClick={handleCellClick}
          />

          {/* Score */}
          <div className="w-full pt-2 border-t border-white/5">
            <p className="text-xs text-slate-600 uppercase tracking-widest text-center mb-2 font-medium">
              Score
            </p>
            <ScoreBoard score={score} />
          </div>
        </div>

        {/* Player legend */}
        <div className="flex gap-6 text-sm animate-fade-in" role="note" aria-label="Player legend">
          <span className="flex items-center gap-2 text-slate-500">
            <span className="font-black text-[#00f5d4] text-lg" aria-hidden="true">✕</span>
            <span>You</span>
          </span>
          <span className="flex items-center gap-2 text-slate-500">
            <span className="font-black text-[#f72585] text-lg" aria-hidden="true">○</span>
            <span>AI</span>
          </span>
        </div>
      </main>
    </>
  );
}

export default App;
