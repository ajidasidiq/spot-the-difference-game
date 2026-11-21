// Bootstrap: size the canvas to the 1280x800 play field, paint the two
// pictures for the current level, run the clock and the render loop, and
// honour ?shot= for deterministic screenshots (the clock is frozen there).
import { VIEW_W, VIEW_H } from './config.js';
import { freshState, tickClock, levelOf, SCREEN_PLAY } from './state.js';
import { renderPanel } from './scenes.js';
import { levelDifferences } from './differences.js';
import { render } from './render.js';
import { bindInput } from './input.js';
import { stageShot } from './shots.js';
import { SoundBank } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW_W;
canvas.height = VIEW_H;
const state = freshState();
const sounds = new SoundBank();
const statusEl = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const shotMode = shotName !== null;

// The two pictures for the current level: left is the original, right
// carries the planted differences.
let panels = paintPanels();

function paintPanels() {
  const scene = levelOf(state).scene;
  const ids = new Set(levelDifferences(scene).map((d) => d.id));
  return {
    left: renderPanel(scene, new Set()),
    right: renderPanel(scene, ids),
  };
}

function refreshPanels() {
  panels = paintPanels();
}

if (shotMode) {
  stageShot(shotName, state);
  refreshPanels();
  // Frozen frame: one render, no clock, no loop.
  render(ctx, state, panels, 1200);
  document.title = `Pasar Malam — shot ${shotName}`;
} else {
  bindInput(canvas, state, sounds, refreshPanels);
  let last = performance.now();
  let lastWhole = -1;

  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    if (state.screen === SCREEN_PLAY) {
      const event = tickClock(state, dt, now);
      if (event === 'tick') sounds.tick();
      if (event === 'timeout') sounds.gameOver();
    }
    const whole = Math.ceil(state.timeLeft);
    if (whole !== lastWhole) {
      lastWhole = whole;
      statusEl.textContent =
        `Level ${state.levelIndex + 1}, ${levelOf(state).name}. ` +
        `${state.found.size} dari ${levelDifferences(levelOf(state).scene).length} perbedaan ketemu. ` +
        `Skor ${state.score}. ${whole} detik tersisa.`;
    }
    render(ctx, state, panels, now);
    requestAnimationFrame(frame);
  }

  function resize() {
    const scale = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
    canvas.style.width = `${Math.floor(VIEW_W * scale)}px`;
    canvas.style.height = `${Math.floor(VIEW_H * scale)}px`;
  }
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
}
