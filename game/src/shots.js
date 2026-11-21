// Deterministic screenshot scenes behind ?shot=cover|garden|title|win.
// Each one drives the real game state to a fixed moment, so the frame is
// what a real play session looks like — found markers, a live counter and
// several differences still hidden — and the same query always gives the
// same frame.
import { LEVELS } from './config.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_WIN, startLevel } from './state.js';

// Stage `state` for the named shot and return the screen to draw.
export function stageShot(name, state) {
  if (name === 'garden') {
    startLevel(state, 1);
    // Two found on the garden level, six still hidden.
    state.found = new Set(['g1', 'g5']);
    state.foundOrder = ['g1', 'g5'];
    state.score = 240;
    state.timeLeft = 61;
    state.screen = SCREEN_PLAY;
    return SCREEN_PLAY;
  }
  if (name === 'title') {
    state.screen = SCREEN_TITLE;
    startLevel(state, 0);
    state.screen = SCREEN_TITLE;
    return SCREEN_TITLE;
  }
  if (name === 'win') {
    startLevel(state, 2);
    state.found = new Set(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9']);
    state.foundOrder = ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'];
    state.screen = SCREEN_WIN;
    state.score = 2840;
    state.totalFound = 24;
    return SCREEN_WIN;
  }
  // Default: 'cover' — level 1 mid-play, three found, four still hidden.
  startLevel(state, 0);
  state.found = new Set(['m2', 'm5', 'm6']);
  state.foundOrder = ['m2', 'm5', 'm6'];
  state.score = 350;
  state.timeLeft = 87;
  state.screen = SCREEN_PLAY;
  return SCREEN_PLAY;
}
