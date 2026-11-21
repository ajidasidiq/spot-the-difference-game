// Procedural painters: every picture is drawn from code, no images.
// Each painter draws one scene onto ctx (PANEL_W x PANEL_H). `diffs` is the
// set of difference ids to apply — the left panel is always painted with an
// empty set, the right panel with the level's differences, so the two
// pictures are identical except for the planted changes. Decorative scatter
// (stars, fireflies, petals) comes from a seeded generator, so both panels
// roll the same dice in the same order.
import { PANEL_W, PANEL_H } from './config.js';
import { mulberry32, sceneSeed } from './random.js';

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(angle) * rad;
    const py = y + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function text(ctx, str, x, y, size, fill, align = 'center', weight = 'bold') {
  ctx.fillStyle = fill;
  ctx.font = `${weight} ${size}px 'Trebuchet MS', Verdana, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function awning(ctx, x, y, w, h, c1, c2) {
  const stripes = 6;
  for (let i = 0; i < stripes; i += 1) {
    rect(ctx, x + (i * w) / stripes, y, w / stripes, h, i % 2 === 0 ? c1 : c2);
  }
  ctx.fillStyle = c1;
  for (let i = 0; i < stripes; i += 1) {
    ctx.beginPath();
    ctx.arc(x + ((i + 0.5) * w) / stripes, y + h, w / stripes / 2, 0, Math.PI);
    ctx.fill();
  }
}

function lantern(ctx, x, y, r, glow) {
  if (glow) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, r * 2.2);
    g.addColorStop(0, 'rgba(255, 190, 90, 0.55)');
    g.addColorStop(1, 'rgba(255, 190, 90, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ff5a4e';
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c22f26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, r * 0.55, r * 1.15, 0, 0, Math.PI * 2);
  ctx.stroke();
  rect(ctx, x - 4, y - r * 1.15 - 4, 8, 5, '#f5b942');
  rect(ctx, x - 4, y + r * 1.15 - 1, 8, 5, '#f5b942');
}

// ---- Scene 1: Pasar Malam (night market street) ----
function paintMarket(ctx, diffs, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#1b1440');
  sky.addColorStop(0.55, '#3b2364');
  sky.addColorStop(1, '#7a3b5e');
  rect(ctx, 0, 0, PANEL_W, PANEL_H, sky);

  // Stars; one bright star at (492, 52) vanishes when diff m7 applies.
  for (let i = 0; i < 46; i += 1) {
    const x = 12 + rng() * (PANEL_W - 24);
    const y = 8 + rng() * 130;
    const r = 0.8 + rng() * 1.6;
    circle(ctx, x, y, r, rng() > 0.85 ? '#ffe9a8' : '#ffffff');
  }
  if (!diffs.has('m7')) star(ctx, 492, 52, 7, '#ffe9a8');
  // Moon; its crater dot vanishes when diff m1 applies.
  circle(ctx, 72, 58, 30, '#fdf6d8');
  circle(ctx, 62, 50, 26, '#f7ead0');
  if (!diffs.has('m1')) circle(ctx, 82, 66, 5, '#e3cf9e');

  // String lights across the street.
  ctx.strokeStyle = '#2a1c44';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 96);
  ctx.quadraticCurveTo(PANEL_W / 2, 132, PANEL_W, 92);
  ctx.stroke();
  const bulbs = ['#ffd166', '#ff6b6b', '#2ec4b6', '#f9f871', '#ff9f5a'];
  for (let i = 0; i < 11; i += 1) {
    const t = i / 10;
    const x = t * PANEL_W;
    const y = 96 + Math.sin(t * Math.PI) * 30 - 4;
    circle(ctx, x, y + 8, 5, bulbs[i % bulbs.length]);
  }

  // Bunting flags under the lights.
  for (let i = 0; i < 9; i += 1) {
    const x = 30 + i * 58;
    ctx.fillStyle = ['#ff6b6b', '#ffd166', '#2ec4b6', '#c77dff'][i % 4];
    ctx.beginPath();
    ctx.moveTo(x, 128);
    ctx.lineTo(x + 26, 128);
    ctx.lineTo(x + 13, 148);
    ctx.closePath();
    ctx.fill();
  }

  // Ground and cobbles.
  rect(ctx, 0, 300, PANEL_W, 100, '#4a3350');
  rect(ctx, 0, 300, PANEL_W, 6, '#5d4266');
  for (let i = 0; i < 8; i += 1) {
    rect(ctx, 20 + i * 68, 330 + (i % 3) * 18, 44, 8, '#5d4266');
  }

  // Stall 1: sate cart on the left.
  rect(ctx, 30, 218, 130, 82, '#6b4226');
  rect(ctx, 30, 218, 130, 10, '#8b5a2b');
  awning(ctx, 22, 188, 146, 26, '#ff6b6b', '#fff3d6');
  text(ctx, diffs.has('m6') ? 'SOTO' : 'SATE', 95, 248, 26, '#fff3d6');
  text(ctx, 'Rp 10rb', 95, 276, 13, '#ffd166');
  circle(ctx, 52, 316, 11, '#3a2b5c');
  circle(ctx, 138, 316, 11, '#3a2b5c');
  // Skewer sticks on the cart.
  ctx.strokeStyle = '#d9a05b';
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.moveTo(48 + i * 18, 232);
    ctx.lineTo(54 + i * 18, 214);
    ctx.stroke();
  }

  // Stall 2: drink stall in the middle; its awning changes colour on m3.
  rect(ctx, 215, 218, 130, 82, '#274156');
  rect(ctx, 215, 218, 130, 10, '#3a5a76');
  const awn = diffs.has('m3') ? '#2ec4b6' : '#ff6b6b';
  awning(ctx, 207, 188, 146, 26, awn, '#fff3d6');
  text(ctx, 'ES TEH', 280, 248, 24, '#fff3d6');
  text(ctx, 'manis • dingin', 280, 274, 12, '#9fd8ef');
  // Cups on the counter.
  for (let i = 0; i < 3; i += 1) {
    rect(ctx, 232 + i * 34, 282, 20, 16, i === 1 ? '#ff9f5a' : '#ffd166');
    rect(ctx, 232 + i * 34, 278, 20, 4, '#ffffff');
  }

  // Stall 3: toy stall on the right.
  rect(ctx, 400, 218, 130, 82, '#54386e');
  rect(ctx, 400, 218, 130, 10, '#6f4d8f');
  awning(ctx, 392, 188, 146, 26, '#ffd166', '#ff6b6b');
  text(ctx, 'MAINAN', 465, 248, 22, '#fff3d6');
  // Balloon bunch; one balloon turns teal on m5.
  ctx.strokeStyle = '#fff3d6';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(430 + i * 22, 300);
    ctx.lineTo(428 + i * 22, 240);
    ctx.stroke();
  }
  circle(ctx, 428, 226, 12, '#ff6b6b');
  circle(ctx, 450, 218, 12, diffs.has('m5') ? '#2ec4b6' : '#ffd166');
  circle(ctx, 472, 226, 12, '#7bc96f');

  // Paper lanterns hanging between the stalls; the middle one is gone on m2.
  lantern(ctx, 190, 150, 14, true);
  if (!diffs.has('m2')) lantern(ctx, 372, 146, 14, true);
  lantern(ctx, 520, 158, 12, true);

  // A cat naps on a crate by the toy stall; it only appears on m4.
  rect(ctx, 372, 330, 46, 30, '#8b5a2b');
  rect(ctx, 372, 330, 46, 5, '#a06a35');
  if (diffs.has('m4')) {
    ctx.fillStyle = '#2b2b3a';
    ctx.beginPath();
    ctx.ellipse(395, 326, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 410, 318, 7, '#2b2b3a');
    ctx.beginPath();
    ctx.moveTo(406, 312);
    ctx.lineTo(408, 304);
    ctx.lineTo(412, 311);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(378, 324);
    ctx.quadraticCurveTo(366, 318, 370, 308);
    ctx.stroke();
  }

  // A vendor silhouette behind the sate cart, waving.
  circle(ctx, 95, 176, 12, '#e8b98a');
  ctx.fillStyle = '#2ec4b6';
  ctx.beginPath();
  ctx.moveTo(78, 216);
  ctx.quadraticCurveTo(95, 184, 112, 216);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e8b98a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(110, 200);
  ctx.lineTo(126, 178);
  ctx.stroke();
}

// ---- Scene 2: Taman Senja (garden at dusk) ----
function paintGarden(ctx, diffs, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#ff9a5a');
  sky.addColorStop(0.5, '#e86a92');
  sky.addColorStop(1, '#5b4a8a');
  rect(ctx, 0, 0, PANEL_W, PANEL_H, sky);
  circle(ctx, 470, 66, 34, '#fff1c9');
  circle(ctx, 458, 56, 28, '#ffe9a8');

  // Distant hills and a big frangipani tree.
  ctx.fillStyle = '#6d5a9e';
  ctx.beginPath();
  ctx.moveTo(0, 260);
  ctx.quadraticCurveTo(140, 190, 300, 250);
  ctx.quadraticCurveTo(430, 300, PANEL_W, 240);
  ctx.lineTo(PANEL_W, PANEL_H);
  ctx.lineTo(0, PANEL_H);
  ctx.closePath();
  ctx.fill();
  rect(ctx, 0, 300, PANEL_W, 100, '#4e7a4a');
  rect(ctx, 0, 300, PANEL_W, 6, '#5d8f57');

  // Tree trunk and canopy; one apple appears on g6.
  rect(ctx, 96, 150, 22, 160, '#6b4226');
  ctx.fillStyle = '#3f7a3a';
  circle(ctx, 108, 130, 62, '#3f7a3a');
  circle(ctx, 60, 160, 44, '#4c8a44');
  circle(ctx, 158, 160, 44, '#4c8a44');
  circle(ctx, 108, 96, 40, '#5d9a52');
  if (diffs.has('g6')) circle(ctx, 148, 138, 8, '#ff4757');
  // A bird perches on a branch only on g3.
  if (diffs.has('g3')) {
    ctx.fillStyle = '#2f3542';
    ctx.beginPath();
    ctx.ellipse(170, 108, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 180, 102, 5, '#2f3542');
    ctx.fillStyle = '#ffa502';
    ctx.beginPath();
    ctx.moveTo(185, 102);
    ctx.lineTo(190, 104);
    ctx.lineTo(185, 106);
    ctx.closePath();
    ctx.fill();
  }

  // Fountain in the middle; its water arc vanishes on g4.
  roundRect(ctx, 250, 300, 120, 26, 10, '#8d9db6');
  rect(ctx, 296, 240, 28, 62, '#aab6c8');
  circle(ctx, 310, 236, 20, '#aab6c8');
  if (!diffs.has('g4')) {
    ctx.strokeStyle = '#bfe8ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(310, 220);
    ctx.quadraticCurveTo(280, 190, 268, 232);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(310, 220);
    ctx.quadraticCurveTo(340, 190, 352, 232);
    ctx.stroke();
  }
  circle(ctx, 310, 306, 10, '#bfe8ff');

  // Bench on the right; one slat is missing on g5.
  rect(ctx, 420, 268, 110, 10, '#8b5a2b');
  if (!diffs.has('g5')) rect(ctx, 420, 286, 110, 10, '#8b5a2b');
  rect(ctx, 428, 296, 8, 34, '#6b4226');
  rect(ctx, 514, 296, 8, 34, '#6b4226');
  rect(ctx, 420, 250, 10, 50, '#8b5a2b');
  rect(ctx, 520, 250, 10, 50, '#8b5a2b');

  // Flower beds: tulips and a sunflower; one tulip turns blue on g1.
  const tulipCols = ['#ff6b81', '#ffd166', '#ff6b81', '#c77dff', '#ff6b81'];
  for (let i = 0; i < 5; i += 1) {
    const x = 200 + i * 26;
    ctx.strokeStyle = '#2f7a2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 360);
    ctx.lineTo(x, 330);
    ctx.stroke();
    const col = i === 2 && diffs.has('g1') ? '#4a7dff' : tulipCols[i];
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(x, 324, 9, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(x - 9, 324, 18, 8);
  }
  // Sunflower by the bench.
  ctx.strokeStyle = '#2f7a2e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(400, 372);
  ctx.lineTo(400, 330);
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.ellipse(400 + Math.cos(a) * 14, 322 + Math.sin(a) * 14, 8, 5, a, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, 400, 322, 10, '#7a4a21');

  // Stepping stones across the lawn; the middle one is gone on g7.
  for (let i = 0; i < 4; i += 1) {
    if (i === 1 && diffs.has('g7')) continue;
    ctx.fillStyle = '#d9d2c5';
    ctx.beginPath();
    ctx.ellipse(60 + i * 46, 356 + (i % 2) * 10, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // A butterfly over the tulips; it is gone on g2.
  if (!diffs.has('g2')) {
    ctx.fillStyle = '#ff9ff3';
    ctx.beginPath();
    ctx.ellipse(268, 296, 10, 7, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(282, 296, 10, 7, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5f27cd';
    ctx.fillRect(273, 292, 4, 10);
  }

  // Fireflies at dusk; the one at (440, 200) is missing on g8.
  const fireflySpots = [[60, 150], [180, 220], [320, 160], [440, 200], [500, 140]];
  for (let i = 0; i < fireflySpots.length; i += 1) {
    if (i === 3 && diffs.has('g8')) continue;
    const x = fireflySpots[i][0] + (rng() - 0.5) * 8;
    const y = fireflySpots[i][1] + (rng() - 0.5) * 8;
    const g = ctx.createRadialGradient(x, y, 1, x, y, 10);
    g.addColorStop(0, 'rgba(255, 240, 140, 0.9)');
    g.addColorStop(1, 'rgba(255, 240, 140, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, x, y, 2.5, '#fff3a0');
  }
}

// ---- Scene 3: Warung Pagi (morning coffee stall) ----
function paintWarung(ctx, diffs, rng) {
  const sky = ctx.createLinearGradient(0, 0, 0, PANEL_H);
  sky.addColorStop(0, '#bfe8ff');
  sky.addColorStop(0.6, '#ffe9b8');
  sky.addColorStop(1, '#ffd166');
  rect(ctx, 0, 0, PANEL_W, PANEL_H, sky);
  circle(ctx, 90, 60, 26, '#fff7d6');
  // Morning clouds.
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.ellipse(300, 56, 70, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(460, 84, 56, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wooden fence and a rooster that only shows up on w4.
  rect(ctx, 0, 250, PANEL_W, 10, '#8b5a2b');
  for (let i = 0; i < 9; i += 1) rect(ctx, 30 + i * 58, 210, 10, 50, '#a06a35');
  if (diffs.has('w4')) {
    ctx.fillStyle = '#d63031';
    ctx.beginPath();
    ctx.arc(500, 200, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(492, 214, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e17055';
    ctx.beginPath();
    ctx.moveTo(508, 204);
    ctx.lineTo(514, 206);
    ctx.lineTo(508, 208);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e17055';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(488, 224);
    ctx.lineTo(486, 234);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(496, 224);
    ctx.lineTo(498, 234);
    ctx.stroke();
  }

  // Ground, table and stools.
  rect(ctx, 0, 300, PANEL_W, 100, '#7a9a5b');
  rect(ctx, 0, 300, PANEL_W, 6, '#8fb06e');
  rect(ctx, 60, 268, 300, 14, '#8b5a2b');
  rect(ctx, 76, 282, 12, 40, '#6b4226');
  rect(ctx, 332, 282, 12, 40, '#6b4226');
  // A stool is missing on w7.
  if (!diffs.has('w7')) {
    rect(ctx, 400, 300, 44, 10, '#a06a35');
    rect(ctx, 408, 310, 8, 22, '#6b4226');
    rect(ctx, 428, 310, 8, 22, '#6b4226');
  }

  // Menu board; the coffee price reads 5K or 8K on w3.
  roundRect(ctx, 380, 96, 140, 110, 8, '#3a2b1c');
  text(ctx, 'MENU', 450, 116, 18, '#ffd166');
  text(ctx, 'Kopi Tubruk', 450, 142, 15, '#fff3d6');
  text(ctx, diffs.has('w3') ? 'Rp 8K' : 'Rp 5K', 450, 164, 15, '#ffd166');
  text(ctx, 'Teh Manis  Rp 4K', 450, 188, 13, '#fff3d6');

  // Wall clock; its hands point at 7:00 or 9:30 on w9.
  circle(ctx, 200, 110, 30, '#fff3d6');
  ctx.strokeStyle = '#3a2b1c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(200, 110, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(200, 110);
  if (diffs.has('w9')) {
    ctx.lineTo(214, 96);
    ctx.moveTo(200, 110);
    ctx.lineTo(184, 114);
  } else {
    ctx.lineTo(200, 90);
    ctx.moveTo(200, 110);
    ctx.lineTo(216, 118);
  }
  ctx.stroke();

  // Hanging bulb; it glows warm, or green and dim on w6.
  ctx.strokeStyle = '#3a2b1c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(310, 0);
  ctx.lineTo(310, 60);
  ctx.stroke();
  if (!diffs.has('w6')) {
    const g = ctx.createRadialGradient(310, 76, 2, 310, 76, 34);
    g.addColorStop(0, 'rgba(255, 220, 130, 0.8)');
    g.addColorStop(1, 'rgba(255, 220, 130, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(310, 76, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  circle(ctx, 310, 76, 12, diffs.has('w6') ? '#7bc96f' : '#ffd166');

  // Kettle on the stove; its spout is gone on w2.
  roundRect(ctx, 130, 240, 90, 30, 6, '#57606f');
  circle(ctx, 175, 222, 26, '#6c7a89');
  rect(ctx, 168, 192, 14, 12, '#57606f');
  if (!diffs.has('w2')) {
    ctx.strokeStyle = '#6c7a89';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(198, 214);
    ctx.lineTo(224, 200);
    ctx.stroke();
  }

  // Coffee cup with steam; the steam curls vanish on w1.
  rect(ctx, 250, 246, 46, 26, '#ff6b6b');
  rect(ctx, 250, 246, 46, 6, '#ffffff');
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 258, 8, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  if (!diffs.has('w1')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(262, 240);
    ctx.quadraticCurveTo(256, 226, 262, 214);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(282, 240);
    ctx.quadraticCurveTo(288, 226, 282, 214);
    ctx.stroke();
  }

  // Kerupuk jar on the table; it is gone on w5.
  if (!diffs.has('w5')) {
    roundRect(ctx, 90, 232, 30, 40, 6, 'rgba(255,255,255,0.75)');
    circle(ctx, 100, 246, 5, '#ff9f5a');
    circle(ctx, 110, 256, 5, '#ffd166');
    circle(ctx, 105, 264, 5, '#ff6b81');
    rect(ctx, 88, 228, 34, 6, '#c0392b');
  }

  // A cat sleeps under the table; it only appears on w8.
  if (diffs.has('w8')) {
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.ellipse(230, 330, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    circle(ctx, 254, 324, 10, '#e67e22');
    ctx.beginPath();
    ctx.moveTo(250, 315);
    ctx.lineTo(252, 306);
    ctx.lineTo(256, 314);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e67e22';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(206, 330);
    ctx.quadraticCurveTo(192, 324, 196, 312);
    ctx.stroke();
  }

  // Rice sacks and a broom leaning by the fence.
  roundRect(ctx, 440, 300, 70, 40, 8, '#d9c9a3');
  text(ctx, 'BERAS', 475, 320, 14, '#6b4226');
  ctx.strokeStyle = '#8b5a2b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(540, 340);
  ctx.lineTo(552, 250);
  ctx.stroke();
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(552, 250);
  ctx.lineTo(546, 232);
  ctx.stroke();

  void rng;
}

const PAINTERS = { market: paintMarket, garden: paintGarden, warung: paintWarung };

// Paint one panel of a scene. `diffs` is a Set of ids applied to this panel.
export function paintScene(ctx, scene, diffs) {
  const rng = mulberry32(sceneSeed(scene));
  ctx.clearRect(0, 0, PANEL_W, PANEL_H);
  PAINTERS[scene](ctx, diffs, rng);
}

// Render a scene to a fresh offscreen canvas and return it.
export function renderPanel(scene, diffs) {
  const canvas = document.createElement('canvas');
  canvas.width = PANEL_W;
  canvas.height = PANEL_H;
  paintScene(canvas.getContext('2d'), scene, diffs);
  return canvas;
}
