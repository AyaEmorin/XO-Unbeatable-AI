# XO – Tic-Tac-Toe Web App

## Product Overview

**XO** is a single-page web application that lets a human player compete against an AI opponent in classic Tic-Tac-Toe (3×3 grid). The app offers two difficulty levels — **Easy** (random AI) and **Hard** (unbeatable Minimax AI) — and persists the player's win/draw/loss record across sessions via `localStorage`.

---

## Goals & Objectives

| Goal | Description |
|------|-------------|
| Playable game | Complete, rule-correct Tic-Tac-Toe against an AI |
| Challenging AI | Minimax with Alpha-Beta Pruning — unbeatable on Hard mode |
| Persistent score | Score survives page refresh (localStorage) |
| Polished UI | Dark-mode glassmorphism design with smooth animations |
| Accessibility | Semantic HTML, ARIA labels, keyboard-friendly |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Testing | Vitest + Testing Library |
| Build | Vite (ESM, production bundle) |

---

## User Roles

- **Player (Human)** — controls "X" marks, always goes first
- **AI Opponent** — controls "O" marks, responds automatically after the player's move

---

## Features

### 1. Game Board

- 3×3 grid of clickable cells
- Cells display **✕** (X) or **○** (O) when occupied
- Winning cells are visually highlighted upon game end
- Board is **disabled** (non-interactive) while the AI is thinking or after the game ends

### 2. AI Opponent

- **Hard mode**: Uses `minimax` with Alpha-Beta Pruning + positional preference (center > corners > edges). The AI is optimal and cannot be beaten.
- **Easy mode**: Picks a random empty cell — beatable by the player.
- AI move is delayed ~300 ms for natural UX feel.

### 3. Difficulty Toggle

- Toggle switch between **Easy** and **Hard**
- Changing difficulty resets the current game immediately

### 4. Game Status Bar

- Displays the current game state:
  - "Your turn" — waiting for player input
  - "AI is thinking…" — AI is computing its move
  - "You win! 🎉" — player wins
  - "AI wins! 🤖" — AI wins
  - "It's a draw! 🤝" — board full, no winner

### 5. Score Board

- Tracks **Wins / Draws / Losses** for the player
- Persisted in `localStorage` under key `xo-score`
- Displayed in a three-column panel beneath the board

### 6. Restart Button

- Resets the board and status to initial state
- Score is **not** reset on restart (only a full page reset would clear it if localStorage is wiped)

---

## Game Flow

```
App Start
   │
   ▼
Player's Turn  ──(click empty cell)──►  Board Updated
                                              │
                                   ┌──────────┴──────────┐
                               Player Wins?          Board Full?
                               (status: player-win)  (status: draw)
                                              │
                                     AI Thinking (300ms delay)
                                              │
                                       AI Plays Move
                                              │
                                   ┌──────────┴──────────┐
                               AI Wins?             Board Full?
                             (status: ai-win)      (status: draw)
                                              │
                                    Back to Player's Turn
```

---

## Component Architecture

```
App
├── <DifficultyToggle>  — Easy / Hard toggle
├── <RestartButton>     — Resets game state
├── <StatusBar>         — Current game status message
├── <Board>             — 3×3 grid container
│   └── <Cell> ×9      — Individual cell (click handler, win highlight)
└── <ScoreBoard>        — Wins / Draws / Losses display
```

---

## Core Logic Modules

| File | Responsibility |
|------|---------------|
| `src/lib/gameLogic.ts` | `checkWinner`, `isDraw`, `createEmptyBoard`, `applyMove`, `getEmptyCells` |
| `src/lib/minimax.ts` | `minimax` (Alpha-Beta), `getBestMove` (Hard), `getRandomMove` (Easy) |
| `src/hooks/useGame.ts` | Central game state machine — board, status, score, AI trigger |

---

## Data Types

```typescript
type Cell = 'X' | 'O' | null;
type BoardState = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]; // 9-element tuple

type GameStatus =
  | 'player-turn'
  | 'ai-thinking'
  | 'player-win'
  | 'ai-win'
  | 'draw';

type Difficulty = 'easy' | 'hard';

interface ScoreRecord {
  wins: number;
  draws: number;
  losses: number;
}

interface WinResult {
  winner: 'X' | 'O' | null;
  line: number[] | null;
}
```

---

## State Machine (useGame hook)

| Current Status | Trigger | Next Status |
|----------------|---------|-------------|
| `player-turn` | Player clicks cell | `ai-thinking` (if no win/draw) |
| `player-turn` | Player clicks cell | `player-win` / `draw` |
| `ai-thinking` | 300ms timer fires, AI plays | `player-turn` (if no win/draw) |
| `ai-thinking` | AI plays winning move | `ai-win` |
| `ai-thinking` | AI fills last cell (draw) | `draw` |
| any | Restart / Difficulty change | `player-turn` |

---

## Scoring Logic

- Player wins (`X` wins) → `wins++`
- AI wins (`O` wins) → `losses++`
- Draw → `draws++`
- Score auto-persists to `localStorage` on every update

---

## Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| Performance | AI move (minimax) completes in < 5ms on any modern browser |
| Accessibility | All interactive elements have ARIA labels; board cells announced to screen readers |
| Responsiveness | Fully usable on mobile (min-width 320px) and desktop |
| No external API | Entirely client-side; works offline |

---

## Test Coverage

Unit tests (Vitest) cover `src/lib/gameLogic.ts`:
- `checkWinner` — all 8 winning lines for X and O
- `isDraw` — full board detection
- `createEmptyBoard` — initial state
- `applyMove` — immutability and correct cell placement

Run tests:

```bash
npm test            # single run
npm run test:watch  # watch mode
npm run test:coverage  # with coverage report
```

---

## Scripts

```bash
npm run dev       # Start development server (Vite HMR)
npm run build     # TypeScript check + production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm test          # Vitest unit tests
```
