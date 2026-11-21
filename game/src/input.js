// Mouse and keyboard: clicks land on either picture (both pictures share
// panel coordinates), H spends a hint, Enter starts or advances, R restarts,
// M mutes. Coordinates are converted from the displayed canvas back to the
// 1280x800 play field, so the game works at any window size.
import { PANEL_W, PANEL_H } from './config.js';
import { LEFT_X, RIGHT_X, PANEL_Y } from './render.js';
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_CLEAR, SCREEN_WIN, SCREEN_OVER, startGame, startLevel, clickAt, useHint } from './state.js';

function panelPoint(canvas, clientX, clientY) {
  const box = canvas.getBoundingClientRect();
  const scaleX = 1280 / box.width;
  const scaleY = 800 / box.height;
  const x = (clientX - box.left) * scaleX;
  const y = (clientY - box.top) * scaleY;
  const inLeft = x >= LEFT_X && x < LEFT_X + PANEL_W && y >= PANEL_Y && y < PANEL_Y + PANEL_H;
  const inRight = x >= RIGHT_X && x < RIGHT_X + PANEL_W && y >= PANEL_Y && y < PANEL_Y + PANEL_H;
  if (inLeft) return { x: x - LEFT_X, y: y - PANEL_Y };
  if (inRight) return { x: x - RIGHT_X, y: y - PANEL_Y };
  return null;
}

export function bindInput(canvas, state, sounds, onPanelsChanged) {
  canvas.addEventListener('pointerdown', (event) => {
    sounds.ensure();
    const point = panelPoint(canvas, event.clientX, event.clientY);
    if (!point) return;
    const result = clickAt(state, point.x, point.y, performance.now());
    if (result === 'found') sounds.found();
    else if (result === 'wrong') sounds.wrong();
  });

  window.addEventListener('keydown', (event) => {
    const now = performance.now();
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      sounds.ensure();
      if (state.screen === SCREEN_TITLE || state.screen === SCREEN_WIN) startGame(state);
      else if (state.screen === SCREEN_CLEAR) startLevel(state, state.levelIndex + 1);
      else if (state.screen === SCREEN_OVER) startLevel(state, state.levelIndex);
      onPanelsChanged();
    } else if (key === 'h' && state.screen === SCREEN_PLAY) {
      if (useHint(state, now)) sounds.hint();
    } else if (key === 'r') {
      startLevel(state, 0);
      state.score = 0;
      state.totalFound = 0;
      onPanelsChanged();
    } else if (key === 'm') {
      sounds.toggleMute();
    }
  });
}
