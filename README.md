# Pasar Malam — Cari Perbedaannya!

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ajidasidiq/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/ajidasidiq/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A spot-the-difference game set in Indonesia, built for the make.fun bounty
**"Make the best spot the difference game"**. Two near-identical pictures sit
side by side — click every hidden difference before the timer runs out.

## How to play

Open `game/index.html` in desktop Chrome (or serve `game/` with any static
server, e.g. `node serve.ts` then http://localhost:8080). No build step, no
network requests: every picture is drawn procedurally by the game's own
canvas code, and every sound is synthesized with WebAudio.

- **Click** a difference on either picture to mark it with a green ring.
- Wrong clicks cost 25 points and 3 seconds.
- **H** spends a hint (3 per level, −40 points): a gold ring pulses around
  one difference that is still hidden.
- **Enter** starts / advances, **R** restarts, **M** mutes.

## The three levels

1. **Pasar Malam** — a night market street: lanterns, sate cart, es teh
   stall, toy stall, string lights. 7 differences, 120 seconds.
2. **Taman Senja** — a garden at dusk: frangipani tree, fountain, tulips,
   bench, fireflies. 8 differences, 105 seconds.
3. **Warung Pagi** — a morning coffee stall: kettle, menu board, wall clock,
   kerupuk jar, a rooster on the fence. 9 differences, 90 seconds.

Finds earn 100 points plus a speed bonus; clearing a level adds a time
bonus of 5 points per second left. Clear all three levels to win.

## Layout

- `game/index.html` — the page, canvas only, no external assets.
- `game/src/config.js` — constants: panel size, scoring, levels.
- `game/src/random.js` — seeded random so both pictures roll the same dice.
- `game/src/scenes.js` — the three original scenes, painted procedurally.
- `game/src/differences.js` — where each planted difference lives.
- `game/src/state.js` — game state: score, timer, hints, screens.
- `game/src/render.js` — HUD, panels, markers, title/win/game-over screens.
- `game/src/input.js` — mouse and keyboard.
- `game/src/audio.js` — synthesized WebAudio sounds.
- `game/src/shots.js` — deterministic `?shot=` scenes for screenshots.
- `game/src/main.js` — bootstrap and game loop.
- `main.ts` — hands the game in: copies `game/` and `screenshots/` to
  `/output` and writes `/output/dossier.json`.
- `screenshots/` — real renders of the game's own code (see `shots.json`).

## Screenshots

Deterministic renders via `?shot=`: `cover` (level 1 mid-play, 3 found, 4
still hidden), `garden` (level 2 mid-play, 2 found, 6 hidden), `title`, and
`win`.

## License

MIT — see `LICENSE`.
