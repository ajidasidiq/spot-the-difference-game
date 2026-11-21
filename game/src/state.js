// The game state: title, playing, level clear, win, game over. One object
// owns score, time, hints and which differences are found, so the renderer
// and the input handler never disagree about the rules.
import { LEVELS, FIND_POINTS, WRONG_POINTS, WRONG_TIME, HINT_POINTS, HINTS_PER_LEVEL } from './config.js';
import { levelDifferences } from './differences.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_CLEAR = 'clear';
export const SCREEN_WIN = 'win';
export const SCREEN_OVER = 'over';

export function freshState() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    score: 0,
    best: 0,
    found: new Set(),
    foundOrder: [],
    hintsLeft: HINTS_PER_LEVEL,
    hintPulse: null,
    hintUntil: 0,
    timeLeft: LEVELS[0].seconds,
    timeBonus: 0,
    wrongFlash: null,
    wrongUntil: 0,
    message: '',
    messageUntil: 0,
    lastTickSecond: -1,
    levelScore: 0,
    totalFound: 0,
  };
}

export function levelOf(state) {
  return LEVELS[state.levelIndex];
}

export function levelDiffs(state) {
  return levelDifferences(levelOf(state).scene);
}

export function remainingCount(state) {
  return levelDiffs(state).length - state.found.size;
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.screen = SCREEN_PLAY;
  state.found = new Set();
  state.foundOrder = [];
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintPulse = null;
  state.timeLeft = LEVELS[index].seconds;
  state.timeBonus = 0;
  state.levelScore = 0;
  state.message = '';
}

export function startGame(state) {
  state.score = 0;
  state.totalFound = 0;
  startLevel(state, 0);
}

// A click at panel coordinates (x, y) on either picture. Returns 'found',
// 'wrong', or null when the click is not on a panel during play.
export function clickAt(state, x, y, now) {
  if (state.screen !== SCREEN_PLAY) return null;
  for (const diff of levelDiffs(state)) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) {
      state.found.add(diff.id);
      state.foundOrder.push(diff.id);
      state.totalFound += 1;
      const bonus = Math.max(0, Math.round(state.timeLeft));
      const gained = FIND_POINTS + Math.min(50, bonus);
      state.score += gained;
      state.levelScore += gained;
      state.message = `Ketemu! +${gained}`;
      state.messageUntil = now + 1200;
      if (state.found.size === levelDiffs(state).length) {
        state.timeBonus = Math.round(state.timeLeft) * 5;
        state.score += state.timeBonus;
        if (state.levelIndex + 1 >= LEVELS.length) {
          state.screen = SCREEN_WIN;
        } else {
          state.screen = SCREEN_CLEAR;
        }
      }
      return 'found';
    }
  }
  state.score = Math.max(0, state.score - WRONG_POINTS);
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME);
  state.wrongFlash = { x, y };
  state.wrongUntil = now + 500;
  state.message = `Bukan itu! -${WRONG_POINTS} poin, -${WRONG_TIME} detik`;
  state.messageUntil = now + 1200;
  return 'wrong';
}

// Spend one hint: pulse a random difference that is still hidden.
export function useHint(state, now) {
  if (state.screen !== SCREEN_PLAY) return null;
  if (state.hintsLeft <= 0) {
    state.message = 'Hint habis!';
    state.messageUntil = now + 1200;
    return null;
  }
  const hidden = levelDiffs(state).filter((d) => !state.found.has(d.id));
  if (hidden.length === 0) return null;
  const pick = hidden[Math.floor(Math.random() * hidden.length)];
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_POINTS);
  state.hintPulse = pick;
  state.hintUntil = now + 2200;
  state.message = `Hint: ${pick.hint} (-${HINT_POINTS})`;
  state.messageUntil = now + 2200;
  return pick;
}

// Advance the clock by dt seconds; returns 'timeout' when time runs out.
export function tickClock(state, dt, now) {
  if (state.screen !== SCREEN_PLAY) return null;
  state.timeLeft -= dt;
  const whole = Math.ceil(state.timeLeft);
  if (whole <= 10 && whole !== state.lastTickSecond && whole > 0) {
    state.lastTickSecond = whole;
    return 'tick';
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_OVER;
    return 'timeout';
  }
  return null;
}
