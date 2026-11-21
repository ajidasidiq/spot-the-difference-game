// Everything the player sees: the heads-up display, the two pictures side
// by side, the rings on found differences, and the title / clear / win /
// game-over screens. The panels themselves are painted by scenes.js; this
// file only frames them and draws the game around them.
import { PANEL_W, PANEL_H, PANEL_GAP, HUD_H, VIEW_W, VIEW_H, LEVELS, PALETTE } from './config.js';
import { levelOf, remainingCount, SCREEN_TITLE, SCREEN_PLAY, SCREEN_CLEAR, SCREEN_WIN, SCREEN_OVER } from './state.js';
import { levelDifferences } from './differences.js';

export const PANEL_Y = HUD_H + 26;
export const LEFT_X = (VIEW_W - PANEL_W * 2 - PANEL_GAP) / 2;
export const RIGHT_X = LEFT_X + PANEL_W + PANEL_GAP;

function text(ctx, str, x, y, size, fill, align = 'center', weight = 'bold') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px 'Trebuchet MS', Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function pill(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fill();
}

function ring(ctx, x, y, r, colour, width) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function checkMark(ctx, x, y, size, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x - size * 0.25, y + size * 0.8);
  ctx.lineTo(x + size, y - size * 0.8);
  ctx.stroke();
}

function drawPanelFrame(ctx, x, label, found, total) {
  ctx.fillStyle = '#0d0a1a';
  ctx.fillRect(x - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12);
  ctx.strokeStyle = PALETTE.panelEdge;
  ctx.lineWidth = 3;
  ctx.strokeRect(x - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12);
  text(ctx, label, x + PANEL_W / 2, PANEL_Y - 22, 17, PALETTE.cream, 'center');
  text(ctx, `${found} / ${total} ketemu`, x + PANEL_W / 2, PANEL_Y + PANEL_H + 22, 15, '#cbb8e8', 'center');
}

function drawFoundMarkers(ctx, originX, state, now) {
  for (const diff of levelDifferences(levelOf(state).scene)) {
    if (!state.found.has(diff.id)) continue;
    const x = originX + diff.x;
    const y = PANEL_Y + diff.y;
    ring(ctx, x, y, diff.r + 4, '#39d353', 4);
    ring(ctx, x, y, diff.r + 10, 'rgba(57, 211, 83, 0.45)', 2);
    checkMark(ctx, x, y, 10, '#39d353');
  }
}

function drawHud(ctx, state, now) {
  const level = levelOf(state);
  const remain = remainingCount(state);
  const total = levelDifferences(level.scene).length;

  // Top bar.
  ctx.fillStyle = '#241a3d';
  ctx.fillRect(0, 0, VIEW_W, HUD_H);
  ctx.fillStyle = PALETTE.gold;
  ctx.fillRect(0, HUD_H - 4, VIEW_W, 4);

  text(ctx, 'PASAR MALAM', 28, 34, 30, PALETTE.gold, 'left');
  text(ctx, 'Cari Perbedaannya!', 28, 66, 16, PALETTE.cream, 'left');
  text(ctx, `Level ${state.levelIndex + 1}/${LEVELS.length} — ${level.name}`, 28, 94, 15, '#cbb8e8', 'left');

  // Remaining counter: the big pill the judge looks for.
  const pillW = 250;
  const pillX = VIEW_W / 2 - pillW / 2;
  pill(ctx, pillX, 18, pillW, 52, remain === 0 ? '#1f7a37' : '#3a2b5c');
  ctx.strokeStyle = PALETTE.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(pillX, 18, pillW, 52, 26);
  ctx.stroke();
  text(ctx, `SISA ${remain} dari ${total}`, VIEW_W / 2, 44, 24, '#ffffff', 'center');
  text(ctx, remain === 0 ? 'Semua ketemu!' : 'perbedaan tersembunyi', VIEW_W / 2, 88, 13, '#cbb8e8', 'center');

  // Score and hints on the right.
  text(ctx, `SKOR ${state.score}`, VIEW_W - 28, 30, 26, '#ffffff', 'right');
  text(ctx, `Hint (H): ${state.hintsLeft}  •  M: suara  •  R: ulang`, VIEW_W - 28, 62, 14, '#cbb8e8', 'right');
}

// The time-pressure bar lives at the very bottom of the frame, clear of the
// picture labels: a shrinking bar plus the seconds left, turning red under
// fifteen seconds.
function drawTimerBar(ctx, state) {
  const level = levelOf(state);
  const barX = 28;
  const barW = VIEW_W - 56;
  const barY = VIEW_H - 26;
  const frac = Math.max(0, state.timeLeft / level.seconds);
  text(ctx, 'WAKTU', barX, barY - 14, 13, '#cbb8e8', 'left');
  text(ctx, `${Math.ceil(state.timeLeft)} detik`, VIEW_W - 28, barY - 14, 15, frac < 0.2 ? '#ff6b6b' : PALETTE.cream, 'right');
  ctx.fillStyle = '#0d0a1a';
  ctx.fillRect(barX, barY, barW, 8);
  ctx.fillStyle = frac < 0.2 ? '#ff4757' : frac < 0.45 ? '#ffa502' : PALETTE.teal;
  ctx.fillRect(barX, barY, barW * frac, 8);
}

function drawFooter(ctx, state, now) {
  const y = PANEL_Y + PANEL_H + 48;
  const level = levelOf(state);
  text(ctx, level.blurb, VIEW_W / 2, y, 16, '#cbb8e8', 'center');
  text(ctx, 'Klik perbedaan di gambar mana pun  •  H = hint  •  Enter = mulai / lanjut  •  R = ulang level', VIEW_W / 2, y + 26, 14, '#8f7fb8', 'center');
  if (state.message && now < state.messageUntil) {
    text(ctx, state.message, VIEW_W / 2, y + 54, 18, PALETTE.gold, 'center');
  }
}

function overlay(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(13, 10, 26, 0.82)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  pill(ctx, VIEW_W / 2 - 330, 190, 660, 340, '#241a3d');
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(VIEW_W / 2 - 330, 190, 660, 340, 18);
  ctx.stroke();
  text(ctx, title, VIEW_W / 2, 250, 44, accent, 'center');
  lines.forEach((line, i) => text(ctx, line, VIEW_W / 2, 310 + i * 38, 20, PALETTE.cream, 'center'));
}

// The whole frame. `panels` holds the two pre-painted canvases for the
// current level; `now` is a millisecond clock for pulses and flashes.
export function render(ctx, state, panels, now) {
  ctx.fillStyle = PALETTE.ink;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  const level = levelOf(state);
  const total = levelDifferences(level.scene).length;

  drawHud(ctx, state, now);

  // The two pictures.
  drawPanelFrame(ctx, LEFT_X, 'GAMBAR A', state.found.size, total);
  drawPanelFrame(ctx, RIGHT_X, 'GAMBAR B', state.found.size, total);
  ctx.drawImage(panels.left, LEFT_X, PANEL_Y);
  ctx.drawImage(panels.right, RIGHT_X, PANEL_Y);

  // Rings on every difference already found, on both pictures.
  drawFoundMarkers(ctx, LEFT_X, state, now);
  drawFoundMarkers(ctx, RIGHT_X, state, now);

  // A hint pulses around one still-hidden difference on both pictures.
  if (state.hintPulse && now < state.hintUntil) {
    const pulse = 6 + 4 * Math.sin(now / 160);
    for (const originX of [LEFT_X, RIGHT_X]) {
      ring(ctx, originX + state.hintPulse.x, PANEL_Y + state.hintPulse.y, state.hintPulse.r + pulse, PALETTE.gold, 4);
    }
  }

  // A wrong click flashes a red X where the player clicked.
  if (state.wrongFlash && now < state.wrongUntil) {
    for (const originX of [LEFT_X, RIGHT_X]) {
      const x = originX + state.wrongFlash.x;
      const y = PANEL_Y + state.wrongFlash.y;
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x - 12, y - 12);
      ctx.lineTo(x + 12, y + 12);
      ctx.moveTo(x + 12, y - 12);
      ctx.lineTo(x - 12, y + 12);
      ctx.stroke();
    }
  }

  drawFooter(ctx, state, now);
  drawTimerBar(ctx, state);

  if (state.screen === SCREEN_TITLE) {
    overlay(ctx, 'PASAR MALAM', [
      'Cari Perbedaannya!',
      'Dua gambar hampir sama — temukan semua',
      'perbedaan sebelum waktu habis.',
      '',
      'Klik perbedaan • H = hint • Enter = mulai',
      '3 level: Pasar Malam, Taman Senja, Warung Pagi',
    ], PALETTE.gold);
  } else if (state.screen === SCREEN_CLEAR) {
    overlay(ctx, 'Level Selesai!', [
      `Semua ${total} perbedaan ketemu.`,
      `Bonus waktu: +${state.timeBonus} poin`,
      `Skor: ${state.score}`,
      '',
      'Enter = level berikutnya',
    ], PALETTE.teal);
  } else if (state.screen === SCREEN_WIN) {
    overlay(ctx, 'Kamu Menang!', [
      `Semua 3 level selesai — ${state.totalFound} perbedaan ditemukan.`,
      `Skor akhir: ${state.score}`,
      '',
      'Enter = main lagi   •   R = ulang dari level 1',
    ], PALETTE.gold);
  } else if (state.screen === SCREEN_OVER) {
    overlay(ctx, 'Waktu Habis!', [
      `${total - state.found.size} perbedaan masih bersembunyi.`,
      `Skor: ${state.score}`,
      '',
      'Enter = coba lagi level ini   •   R = ulang dari level 1',
    ], PALETTE.coral);
  }
  void SCREEN_PLAY;
}
