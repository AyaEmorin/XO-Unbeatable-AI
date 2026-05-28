# 📖 XO — System Documentation

> เอกสารอธิบายการทำงานทั้งหมดของระบบ XO (Tic-Tac-Toe) ที่ AI เล่นไม่มีทางแพ้

---

## สารบัญ

- [1. ภาพรวมของระบบ](#1-ภาพรวมของระบบ)
- [2. Tech Stack](#2-tech-stack)
- [3. โครงสร้างโปรเจกต์ (Project Structure)](#3-โครงสร้างโปรเจกต์-project-structure)
- [4. Data Types — ระบบ Type ทั้งหมด](#4-data-types--ระบบ-type-ทั้งหมด)
- [5. Core Logic — ตรรกะหลักของเกม](#5-core-logic--ตรรกะหลักของเกม)
  - [5.1 gameLogic.ts — ฟังก์ชันพื้นฐาน](#51-gamelogicts--ฟังก์ชันพื้นฐาน)
  - [5.2 minimax.ts — AI Engine](#52-minimaxts--ai-engine)
- [6. State Management — useGame Hook](#6-state-management--usegame-hook)
- [7. Components — ส่วน UI](#7-components--ส่วน-ui)
- [8. Styling & Design System](#8-styling--design-system)
- [9. Game Flow — ลำดับการทำงาน](#9-game-flow--ลำดับการทำงาน)
- [10. Testing — ระบบทดสอบ](#10-testing--ระบบทดสอบ)
- [11. Build & Deployment](#11-build--deployment)
- [12. Configuration Files](#12-configuration-files)

---

## 1. ภาพรวมของระบบ

**XO** เป็นเว็บแอปพลิเคชันแบบ Single-Page Application (SPA) สำหรับเล่นเกม Tic-Tac-Toe (OX) กับ AI

### ฟีเจอร์หลัก

| ฟีเจอร์ | รายละเอียด |
|---------|-----------|
| 🎮 เกม Tic-Tac-Toe | กระดาน 3×3 เล่นกับ AI |
| 🤖 AI 2 ระดับ | **Easy** (สุ่ม) / **Hard** (Minimax — ชนะไม่ได้) |
| 💾 บันทึกคะแนน | Win/Draw/Loss เก็บใน `localStorage` ข้ามเซสชัน |
| 🌙 Dark Mode | ดีไซน์ Glassmorphism พร้อม Neon Glow |
| ♿ Accessibility | Semantic HTML, ARIA labels, รองรับ Keyboard |
| 📱 Responsive | ใช้ได้ทั้ง Mobile (320px+) และ Desktop |
| ☁️ Offline | ทำงาน Client-side ทั้งหมด ไม่มี API call |

### ผู้เล่น

- **Player (คุณ)** → เล่นเป็น **X** (✕) เดินก่อนเสมอ
- **AI** → เล่นเป็น **O** (○) ตอบโต้อัตโนมัติหลังผู้เล่นเดิน

---

## 2. Tech Stack

| Layer | เทคโนโลยี | เวอร์ชัน |
|-------|-----------|---------|
| Framework | React | 19 |
| Build Tool | Vite | 8 |
| Language | TypeScript | 6.0 |
| Styling | Tailwind CSS + Custom CSS | 3.4 |
| Testing | Vitest + Testing Library | 4.1 |
| Deployment | Cloudflare Pages (Wrangler) | — |
| Font | Inter (Google Fonts) | — |

---

## 3. โครงสร้างโปรเจกต์ (Project Structure)

```
XO/
├── index.html                    # HTML entry point (Vite SPA)
├── package.json                  # Dependencies & Scripts
├── vite.config.ts                # Vite + Vitest configuration
├── tailwind.config.js            # Tailwind CSS customization
├── postcss.config.js             # PostCSS (Tailwind plugin)
├── tsconfig.json                 # TypeScript root config
├── tsconfig.app.json             # TS config สำหรับ app code
├── tsconfig.node.json            # TS config สำหรับ Node (Vite config)
├── eslint.config.js              # ESLint configuration
├── wrangler.toml                 # Cloudflare Pages deploy config
├── PRD.md                        # Product Requirements Document
├── dist/                         # Production build output
├── public/                       # Static assets (favicon ฯลฯ)
│
└── src/
    ├── main.tsx                  # React entry — mount <App /> ลง DOM
    ├── App.tsx                   # Root component — ประกอบ UI ทั้งหมด
    ├── index.css                 # Global styles + Design system
    │
    ├── types/
    │   └── game.ts               # Type definitions ทั้งหมด
    │
    ├── lib/
    │   ├── gameLogic.ts          # ฟังก์ชัน game rules (checkWinner, isDraw ฯลฯ)
    │   ├── minimax.ts            # AI Engine (Minimax + Trap Scoring)
    │   └── __tests__/
    │       ├── gameLogic.test.ts  # Unit tests สำหรับ game logic
    │       └── minimax.test.ts   # Unit tests + Unbeatability proof
    │
    ├── hooks/
    │   └── useGame.ts            # Central state machine hook
    │
    ├── components/
    │   ├── Board.tsx             # กระดาน 3×3 (grid container)
    │   ├── Cell.tsx              # ช่องแต่ละช่อง (click + keyboard + A11y)
    │   ├── StatusBar.tsx         # แถบแสดงสถานะ (Your turn / AI thinking ฯลฯ)
    │   ├── ScoreBoard.tsx        # แผง Wins / Draws / Losses
    │   ├── DifficultyToggle.tsx  # สวิตช์เลือก Easy / Hard
    │   └── RestartButton.tsx     # ปุ่ม New Game
    │
    └── test/
        └── setup.ts              # Vitest test setup (jsdom)
```

---

## 4. Data Types — ระบบ Type ทั้งหมด

> **ไฟล์**: `src/types/game.ts`

```typescript
// ค่าในแต่ละช่อง: X, O, หรือ null (ว่าง)
type CellValue = 'X' | 'O' | null;

// กระดาน = array 9 ช่อง (index 0–8)
//   0 | 1 | 2
//   ---------
//   3 | 4 | 5
//   ---------
//   6 | 7 | 8
type BoardState = CellValue[];

// ระดับความยาก
type Difficulty = 'easy' | 'hard';

// สถานะเกม (State Machine)
type GameStatus =
  | 'idle'           // พร้อมเล่น (ไม่ได้ใช้ในปัจจุบัน)
  | 'playing'        // กำลังเล่น (ไม่ได้ใช้ในปัจจุบัน)
  | 'player-turn'    // ✕ รอผู้เล่นเดิน
  | 'ai-thinking'    // ○ AI กำลังคิด (delay 300ms)
  | 'player-win'     // ✕ ผู้เล่นชนะ
  | 'ai-win'         // ○ AI ชนะ
  | 'draw';          // เสมอ

// ผลการตรวจผู้ชนะ
interface WinResult {
  winner: CellValue;     // 'X' | 'O' | null
  line: number[] | null; // เช่น [0,1,2] = แถวบน
}

// คะแนนสะสม
interface ScoreRecord {
  wins: number;    // ผู้เล่นชนะ
  draws: number;   // เสมอ
  losses: number;  // ผู้เล่นแพ้
}

// สถานะเกมทั้งหมด (ใช้เป็น interface อ้างอิง)
interface GameState {
  board: BoardState;
  status: GameStatus;
  winLine: number[] | null;
  difficulty: Difficulty;
  score: ScoreRecord;
}
```

---

## 5. Core Logic — ตรรกะหลักของเกม

### 5.1 `gameLogic.ts` — ฟังก์ชันพื้นฐาน

> **ไฟล์**: `src/lib/gameLogic.ts`

โมดูลนี้เป็น **pure functions** ไม่มี side effect — ทำให้ทดสอบง่ายและนำไปใช้ซ้ำได้

#### `WIN_LINES`
```
เส้นชนะทั้ง 8 เส้น:
  [0,1,2]  แถวบน         [0,3,6]  คอลัมน์ซ้าย
  [3,4,5]  แถวกลาง       [1,4,7]  คอลัมน์กลาง
  [6,7,8]  แถวล่าง       [2,5,8]  คอลัมน์ขวา
  [0,4,8]  ทแยง ↘        [2,4,6]  ทแยง ↙
```

#### ฟังก์ชันทั้งหมด

| ฟังก์ชัน | Input | Output | หน้าที่ |
|---------|-------|--------|---------|
| `checkWinner(board)` | `BoardState` | `WinResult` | วนลูป 8 เส้นชนะ ถ้า 3 ช่องเหมือนกัน → คืน winner + line |
| `isDraw(board)` | `BoardState` | `boolean` | ตรวจว่ากระดานเต็มหรือยัง (**ไม่ตรวจ** ว่ามีผู้ชนะ — ต้องเรียก `checkWinner` ก่อน) |
| `getEmptyCells(board)` | `BoardState` | `number[]` | คืน index ช่องที่ว่างทั้งหมด |
| `createEmptyBoard()` | — | `BoardState` | สร้างกระดานว่าง (9×null) |
| `applyMove(board, index, player)` | `BoardState`, `number`, `'X'\|'O'` | `BoardState` | คืนกระดานใหม่ที่วาง mark แล้ว (**immutable** — ไม่แก้ original) |

---

### 5.2 `minimax.ts` — AI Engine

> **ไฟล์**: `src/lib/minimax.ts`

ระบบ AI ประกอบด้วย 2 ระดับ:

#### Easy Mode — `getRandomMove(board)`

สุ่มเลือกช่องว่างแบบสุ่ม → ผู้เล่นชนะได้

#### Hard Mode — `getBestMove(board)` + `minimaxFull()`

ใช้ **Minimax Algorithm** พร้อมเทคนิคพิเศษ:

```
┌─────────────────────────────────────────────────────┐
│              Minimax + Trap Scoring                 │
│                                                     │
│  1. Memoization (Transposition Table)               │
│     → แคช boardState + turn เป็น Map<string, result>│
│     → ไม่คำนวณ board เดิมซ้ำ                         │
│                                                     │
│  2. Depth-Adjusted Scoring                          │
│     → AI ชนะ:  +10 - depth  (ชนะเร็ว = คะแนนสูง)    │
│     → AI แพ้:  depth - 10   (แพ้ช้า = คะแนนสูงกว่า)  │
│     → เสมอ:    0                                     │
│                                                     │
│  3. Trap Score (เทคนิคพิเศษ)                         │
│     → นับผลรวม terminal states ทุก branch            │
│     → trapScore สูง = มี branch ที่ AI ชนะเยอะ       │
│     → ใช้ break tie เมื่อ minimax score เท่ากัน       │
│     → ทำให้ AI "วางกับดัก" ผู้เล่นที่เล่นไม่สมบูรณ์  │
│                                                     │
│  4. Tie-Breaking                                    │
│     → score เท่ากัน → เลือกตัวที่ trapScore สูงกว่า   │
│     → trapScore เท่ากัน → สุ่มเลือก                  │
└─────────────────────────────────────────────────────┘
```

#### Flow การทำงานของ `getBestMove()`:

```
getBestMove(board)
  │
  ├── วนลูปทุกช่องว่าง
  │     │
  │     ├── ลองวาง O ที่ช่อง i → nextBoard
  │     ├── เรียก minimaxFull(nextBoard, 0, false)
  │     │     │
  │     │     ├── ตรวจ terminal state (ชนะ/แพ้/เสมอ)
  │     │     │     → คืน { score, trapScore }
  │     │     │
  │     │     ├── ถ้ายังไม่จบ → วนลูปต่อ (Recursion)
  │     │     │     • isMaximizing=true  → AI เลือก score สูงสุด
  │     │     │     • isMaximizing=false → Player เลือก score ต่ำสุด
  │     │     │
  │     │     └── ตรวจ memo cache ก่อนคำนวณ
  │     │
  │     └── เปรียบเทียบ: score > bestScore? trapScore > bestTrap?
  │
  └── คืน index ที่ดีที่สุด (สุ่มถ้า tie)
```

#### ฟังก์ชัน `minimax()` (backwards compatible)

Wrapper ของ `minimaxFull()` ที่คืนเฉพาะ `score` (number) — ใช้ใน unit tests ที่เขียนไว้ก่อน

#### ประสิทธิภาพ

| Scenario | เวลา |
|----------|------|
| Empty board (worst case) | < 500ms |
| Mid-game (3 ช่องว่าง) | < 50ms |

---

## 6. State Management — `useGame` Hook

> **ไฟล์**: `src/hooks/useGame.ts`

Custom React Hook ที่เป็นหัวใจของระบบ — จัดการ state ทั้งหมดแบบ **State Machine**

### State ที่จัดการ

| State | Type | ค่าเริ่มต้น | คำอธิบาย |
|-------|------|------------|----------|
| `board` | `BoardState` | `[null × 9]` | สถานะกระดาน |
| `status` | `GameStatus` | `'player-turn'` | สถานะเกม |
| `winLine` | `number[] \| null` | `null` | เส้นที่ชนะ (ใช้ highlight) |
| `difficulty` | `Difficulty` | `'hard'` | ระดับความยาก |
| `score` | `ScoreRecord` | จาก localStorage | คะแนนสะสม |

### State Machine Diagram

```
                   ┌──────────────┐
                   │              │
         ┌────────│ player-turn  │◄────────────────────┐
         │        │              │                     │
         │        └──────┬───────┘                     │
         │               │                            │
         │        ผู้เล่นคลิกช่อง                       │
         │               │                            │
         │    ┌──────────┼──────────┐                  │
         │    ▼          ▼          ▼                  │
    ┌─────────┐  ┌──────────┐  ┌────────────┐         │
    │player   │  │  draw    │  │ai-thinking │         │
    │  -win   │  │          │  │            │         │
    └─────────┘  └──────────┘  └─────┬──────┘         │
                                     │                │
                              AI เดิน (300ms delay)    │
                                     │                │
                          ┌──────────┼──────────┐     │
                          ▼          ▼          ▼     │
                    ┌─────────┐ ┌────────┐ ┌────┴────┐
                    │ ai-win  │ │  draw  │ │player   │
                    │         │ │        │ │ -turn   │
                    └─────────┘ └────────┘ └─────────┘
                    
                    ↺ Restart / เปลี่ยน Difficulty → player-turn
```

### ฟังก์ชันที่ return

| ฟังก์ชัน | คำอธิบาย |
|---------|----------|
| `handleCellClick(index)` | ผู้เล่นคลิกช่อง — วาง X, ตรวจชนะ/เสมอ, เปลี่ยน status เป็น `ai-thinking` |
| `resetGame()` | รีเซ็ตกระดานและ status (**ไม่** รีเซ็ตคะแนน) |
| `setDifficulty(d)` | เปลี่ยน Easy/Hard + รีเซ็ตกระดานทันที |

### การทำงานภายใน

#### `finalize(nextBoard, justPlayed)`
- ตรวจผู้ชนะ → อัปเดต `status` + `score`
- ตรวจเสมอ → อัปเดต `status` + `score`
- ยังไม่จบ → สลับ turn

#### AI Move Effect (`useEffect`)
- Trigger เมื่อ `status === 'ai-thinking'`
- หน่วงเวลา **300ms** ด้วย `setTimeout` เพื่อ UX ที่เป็นธรรมชาติ
- ใช้ `boardRef` (useRef) อ่าน board ล่าสุดเพื่อหลีกเลี่ยงปัญหา stale closure
- เรียก `getBestMove()` หรือ `getRandomMove()` ตาม difficulty
- **Bug Fix สำคัญ**: คำนวณ nextBoard ด้วย `boardRef.current` แล้วเรียก `setBoard(nextBoard)` แยกจาก `finalize()` — เพื่อป้องกัน React StrictMode เรียก updater function 2 ครั้ง ทำให้คะแนนเพิ่มเป็น 2

#### localStorage Persistence
- **Load**: `loadScore()` — อ่านจาก key `xo-score`, parse JSON, validate shape
- **Save**: `saveScore()` — เขียนทุกครั้งที่ `score` เปลี่ยน (ผ่าน `useEffect`)
- **Error Handling**: ป้องกัน parse error และ write error (e.g., Private Browsing)

---

## 7. Components — ส่วน UI

### Component Tree

```
App
├── <div.orb> ×3              ← พื้นหลังลูกบอลเรือง
├── <header>                  ← ชื่อ "XO" + subtitle
├── <div.glass-card>          ← กล่อง glassmorphism หลัก
│   ├── <DifficultyToggle>    ← สวิตช์ Easy / Hard
│   ├── <RestartButton>       ← ปุ่ม "↺ New Game"
│   ├── <StatusBar>           ← แถบสถานะ (Your turn / AI thinking ฯลฯ)
│   ├── <Board>               ← กระดาน 3×3
│   │   └── <Cell> ×9         ← ช่องแต่ละช่อง
│   └── <ScoreBoard>          ← Wins / Draws / Losses
└── <div.legend>              ← คำอธิบาย ✕=You, ○=AI
```

---

### `App.tsx` — Root Component

> **ไฟล์**: `src/App.tsx`

- เรียกใช้ `useGame()` hook รับ state และ actions ทั้งหมด
- คำนวณ `isBoardDisabled` = `status !== 'player-turn'`
- ประกอบ UI จาก component ย่อย
- สร้าง orbs สำหรับ background decoration

---

### `Board.tsx` — กระดาน 3×3

> **ไฟล์**: `src/components/Board.tsx`

| Props | Type | คำอธิบาย |
|-------|------|----------|
| `board` | `BoardState` | สถานะกระดาน 9 ช่อง |
| `winLine` | `number[] \| null` | ช่องที่ชนะ (ไฮไลท์) |
| `winner` | `CellValue` | ผู้ชนะ (เพื่อเลือกสี highlight) |
| `isDisabled` | `boolean` | ปิดการคลิก |
| `onCellClick` | `(index) => void` | callback เมื่อคลิกช่อง |

**การทำงาน**:
- สร้าง `Set` จาก `winLine` เพื่อ O(1) lookup
- Render 9 `<Cell>` component โดยส่ง `isWinCell` = ว่าช่องนั้นอยู่ในเส้นชนะหรือไม่
- ใช้ CSS `role="grid"` สำหรับ accessibility

---

### `Cell.tsx` — ช่องแต่ละช่อง

> **ไฟล์**: `src/components/Cell.tsx`

คอมโพเนนต์ที่ซับซ้อนที่สุด — รองรับทั้ง mouse, keyboard, screen reader

| Props | Type | คำอธิบาย |
|-------|------|----------|
| `value` | `CellValue` | ค่าในช่อง: `'X'`, `'O'`, `null` |
| `index` | `number` | ตำแหน่ง 0–8 |
| `isWinCell` | `boolean` | อยู่ในเส้นชนะ? |
| `winner` | `CellValue` | ผู้ชนะ (เลือกสี glow) |
| `isDisabled` | `boolean` | ปิดการคลิก |
| `onClick` | `(index) => void` | callback |

**Accessibility**:
- `POSITION_LABELS`: แปลง index เป็น "top-left", "center", "bottom-right" ฯลฯ
- `aria-label`: "X in top-left" หรือ "Empty center — click to play"
- `role="button"`, `tabIndex`, `aria-pressed`, `aria-disabled`
- รองรับ `Enter` และ `Space` key

**CSS Classes**:
- `.cell` — base style
- `.cell--filled` — cursor: default
- `.cell--disabled` — cursor: not-allowed
- `.cell--win` / `.cell--win-x` / `.cell--win-o` — pulse animation + glow

---

### `StatusBar.tsx` — แถบสถานะ

> **ไฟล์**: `src/components/StatusBar.tsx`

ใช้ `STATUS_CONFIG` map เพื่อแปลง `GameStatus` → `{ text, emoji, colorClass }`

| Status | ข้อความ | Emoji | Animation |
|--------|--------|-------|-----------|
| `player-turn` | Your turn | ✕ | slide-up |
| `ai-thinking` | AI is thinking… | ○ | spin |
| `player-win` | You won! | 🏆 | bounce-in |
| `ai-win` | AI wins! | 🤖 | bounce-in |
| `draw` | You drew! | 🤝 | bounce-in |

- `key={status}` — บังคับ re-mount เพื่อ retrigger animation ทุกครั้งที่ status เปลี่ยน
- `role="status"` + `aria-live="polite"` — screen reader ประกาศอัตโนมัติ

---

### `ScoreBoard.tsx` — แผงคะแนน

> **ไฟล์**: `src/components/ScoreBoard.tsx`

แสดง 3 badge ในรูปแบบ grid 3 คอลัมน์:

| Badge | สี | Border |
|-------|---|--------|
| Wins | `#00f5d4` (Neon Cyan) | `rgba(0,245,212,0.2)` |
| Draws | `indigo-400` | `rgba(99,102,241,0.2)` |
| Losses | `#f72585` (Neon Pink) | `rgba(247,37,133,0.2)` |

---

### `DifficultyToggle.tsx` — สวิตช์ระดับความยาก

> **ไฟล์**: `src/components/DifficultyToggle.tsx`

Radio group แบบ pill toggle:
- ปุ่ม **Easy** / **Hard**
- Active state = gradient background `#3d5afe → #6d28d9` + box-shadow
- `role="radio"` + `aria-checked` สำหรับ accessibility
- เปลี่ยน difficulty → รีเซ็ตเกมทันที

---

### `RestartButton.tsx` — ปุ่ม New Game

> **ไฟล์**: `src/components/RestartButton.tsx`

ปุ่ม pill-shaped "↺ New Game":
- รีเซ็ตกระดานและ status
- **ไม่** รีเซ็ตคะแนน
- มี hover effect (ยกขึ้น + glow) และ focus-visible outline

---

## 8. Styling & Design System

> **ไฟล์**: `src/index.css` + `tailwind.config.js`

### Design Tokens (CSS Custom Properties)

```css
:root {
  --bg-primary:   #0a0e1a;              /* พื้นหลังหลัก — เกือบดำ */
  --bg-secondary: #111827;              /* พื้นหลังรอง */
  --bg-card:      rgba(17,24,39,0.8);   /* การ์ด glassmorphism */
  --border-glass: rgba(99,102,241,0.15);/* ขอบการ์ด (indigo) */
  --glow-x:       rgba(0,245,212,0.5);  /* Glow สำหรับ X (cyan) */
  --glow-o:       rgba(247,37,133,0.5); /* Glow สำหรับ O (pink) */
}
```

### Color Palette

| ชื่อ | Hex | การใช้งาน |
|------|-----|----------|
| Neon X | `#00f5d4` | สี ✕ ผู้เล่น, Wins, text glow |
| Neon O | `#f72585` | สี ○ AI, Losses, text glow |
| Brand (Indigo) | `#3d5afe` | Toggle active, orb, draws |
| Purple | `#6d28d9` | Toggle gradient, UI accents |

### Animations (Keyframes)

| Animation | ใช้ที่ | Effect |
|-----------|------|--------|
| `scale-in` | Symbol ✕/○ ปรากฏ | Scale 0.35 → 1 + rotate |
| `pulse-win` | Winning cells | Scale 1 ↔ 1.06 (infinite) |
| `fade-in` | Header, legend | Opacity 0 → 1 |
| `slide-up` | Glass card, status bar | Translate Y + fade |
| `bounce-in` | Game end emoji | Scale 0.3 → 1.08 → 1 |
| `glow-pulse` | (ใช้ Tailwind theme) | Box-shadow pulse |

### Glassmorphism Card

```css
.glass-card {
  background: rgba(17,24,39,0.8);    /* Semi-transparent */
  backdrop-filter: blur(20px);        /* Frosted glass */
  border: 1px solid rgba(99,102,241,0.15);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.05);
}
```

### Board Grid Lines

ใช้ **CSS gradients** แทน border เพื่อหลีกเลี่ยง doubled edges:
- 2 เส้นตั้ง + 2 เส้นนอน ผ่าน `::before` pseudo-element
- สี `rgba(99,102,241,0.25)` (indigo)

### Background Orbs

3 วงกลม blur ลอยอยู่หลัง UI:
- `.orb-1`: สีน้ำเงิน `#3d5afe` — มุมซ้ายบน
- `.orb-2`: สีชมพู `#f72585` — มุมขวาล่าง
- `.orb-3`: สีเขียว `#00f5d4` — กลาง-ขวา

ทั้งหมดมี `filter: blur(80px)`, `opacity: 0.12`, `pointer-events: none`

---

## 9. Game Flow — ลำดับการทำงาน

### เริ่มต้น (App Start)

```
main.tsx
  └── createRoot(#root).render(<StrictMode><App /></StrictMode>)
        └── App()
              └── useGame() ← สร้าง state เริ่มต้น
                    • board = [null × 9]
                    • status = 'player-turn'
                    • difficulty = 'hard'
                    • score = loadScore() จาก localStorage
```

### เมื่อผู้เล่นคลิกช่อง

```
1. Cell.onClick(index)
     └── handleCellClick(index)
           ├── Guard: status !== 'player-turn' → return
           ├── Guard: board[index] !== null → return
           ├── nextBoard = applyMove(board, index, 'X')
           ├── setBoard(nextBoard)
           └── finalize(nextBoard, 'X')
                 ├── checkWinner(nextBoard)
                 │     ├── winner='X' → status='player-win', wins++
                 │     └── winner=null → ต่อ ↓
                 ├── isDraw(nextBoard)
                 │     ├── true → status='draw', draws++
                 │     └── false → ต่อ ↓
                 └── status = 'ai-thinking'

2. useEffect [status === 'ai-thinking']
     └── setTimeout(300ms)
           ├── move = getBestMove(board) หรือ getRandomMove(board)
           ├── nextBoard = applyMove(board, move, 'O')
           ├── setBoard(nextBoard)
           └── finalize(nextBoard, 'O')
                 ├── winner='O' → status='ai-win', losses++
                 ├── draw → status='draw', draws++
                 └── ไม่จบ → status='player-turn' ← วนกลับ
```

### เมื่อกด Restart

```
resetGame()
  ├── setBoard([null × 9])
  ├── setWinLine(null)
  └── setStatus('player-turn')
      (ไม่แตะ score)
```

### เมื่อเปลี่ยน Difficulty

```
setDifficulty('easy' | 'hard')
  ├── setDifficultyState(d)
  ├── setBoard([null × 9])
  ├── setWinLine(null)
  └── setStatus('player-turn')
```

---

## 10. Testing — ระบบทดสอบ

### Setup

- **Framework**: Vitest 4.1
- **Environment**: jsdom (simulate browser DOM)
- **Assertion Library**: Vitest built-in + Testing Library matchers
- **Setup File**: `src/test/setup.ts`

### Test Files

#### `gameLogic.test.ts` (4 test suites, 12 tests)

| Suite | Tests | ครอบคลุม |
|-------|-------|---------|
| `checkWinner` | 4 | Empty board, X ชนะ 8 เส้น, O ชนะ 8 เส้น, no winner, multiple winners |
| `isDraw` | 4 | Empty, partial, full board, full+winner |
| `getEmptyCells` | 3 | All empty, full, partial |
| `applyMove` | 3 | Place value, immutability, preserve other cells |
| `createEmptyBoard` | 2 | Length + nulls, independence |

#### `minimax.test.ts` (4 test suites, 14 tests)

| Suite | Tests | ครอบคลุม |
|-------|-------|---------|
| `minimax` | 4 | Positive/negative scores, draw=0, depth preference |
| `getBestMove` | 6 | Win immediately, block player, prefer win over block, center on empty, valid index, throw on full |
| `getRandomMove` | 5 | Valid cell, only remaining, throw on full, range [0,8], only empty cells |
| `performance` | 2 | Empty board < 500ms, mid-game < 50ms |

#### 🏆 Exhaustive Unbeatability Proof

ใน `minimax.test.ts` มี test พิเศษที่ **พิสูจน์ทางคณิตศาสตร์** ว่า Hard mode ชนะไม่ได้:
- Simulate ทุก combination ที่ผู้เล่น (X) เลือกได้
- AI (O) ใช้ `getBestMove()` ทุกครั้ง
- Assert: ไม่มี terminal state ใดที่ X ชนะ
- ผลลัพธ์: ทุก terminal = AI ชนะ หรือ เสมอ

### คำสั่ง Test

```bash
npm test                # รันครั้งเดียว
npm run test:watch      # watch mode (auto re-run)
npm run test:coverage   # พร้อม coverage report (V8 provider)
```

---

## 11. Build & Deployment

### Development

```bash
npm run dev     # Vite dev server พร้อม HMR
```

### Production Build

```bash
npm run build   # TypeScript check → Vite production bundle → ./dist/
```

### Preview

```bash
npm run preview # Serve production build locally
```

### Deploy to Cloudflare Pages

```bash
npm run deploy      # Build + deploy ด้วย Wrangler
npm run deploy:ci   # Deploy only (ไม่ build — สำหรับ CI/CD)
```

**Cloudflare Config** (`wrangler.toml`):
- Project name: `xo-unbeatable-ai`
- Assets directory: `./dist`
- Compatibility date: `2026-05-27`

---

## 12. Configuration Files

### `vite.config.ts`

```typescript
{
  base: '/',                    // Base URL
  plugins: [react()],           // React Fast Refresh
  test: {
    globals: true,              // ไม่ต้อง import describe/it/expect
    environment: 'jsdom',       // Simulate browser
    setupFiles: ['./src/test/setup.ts'],
    css: true,                  // Process CSS ใน tests
    coverage: { provider: 'v8', reporter: ['text','json','html'] }
  }
}
```

### `tailwind.config.js`

Custom theme ที่เพิ่มเข้ามา:
- **Font**: Inter, system-ui, sans-serif
- **Colors**: `brand` (50–900 indigo scale), `neon.x` (#00f5d4), `neon.o` (#f72585)
- **Animations**: scale-in, pulse-win, fade-in, slide-up, bounce-in, spin-slow
- **Box Shadows**: glass, neon, neon-x, neon-o
- **Safelist**: Ensure dynamic classes are not purged

### `index.html`

- Lang: `en`
- Title: "XO — Unbeatable Tic-Tac-Toe"
- Meta description: SEO-ready
- Theme color: `#0a0e1a` (dark)
- Favicon: `/favicon.svg`
- Entry: `/src/main.tsx` (ESM module)

---

> **สร้างเอกสารนี้**: 28 พฤษภาคม 2026
