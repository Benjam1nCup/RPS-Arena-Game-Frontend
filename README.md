# RPS Arena — Frontend

Production-quality MVP frontend for **RPS Arena**, a real-time multiplayer Rock-Paper-Scissors Web3 game.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Mock wallet, token, matchmaking, rooms, game, and transaction services

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Main routes

- `/` — Landing
- `/lobby` — Quick match, create/join rooms
- `/buy` — Buy RPS in-app
- `/room/[roomId]` — Waiting room
- `/game/[gameId]` — Live match
- `/result/[gameId]` — Match outcome
- `/profile`, `/history`, `/leaderboard`, `/how-it-works`

## Mock flow

Connect wallet (session-persisted), choose stake, matchmake with simulated delays, play RPS with opponent AI, view results and updated balances. Purchases run through a multi-step transaction modal.

Replace services under `src/services/` with real API and wallet integrations when the backend is ready; UI uses hooks and service interfaces designed for swap-in.
