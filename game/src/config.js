// Shared constants for Pasar Malam, a spot-the-difference game.
// One picture panel is PANEL_W x PANEL_H; the two panels sit side by side
// under a heads-up display that always shows score, time and how many
// differences are still hidden.
export const PANEL_W = 560;
export const PANEL_H = 400;
export const PANEL_GAP = 36;
export const HUD_H = 118;

// The play field is laid out for a 1280x800 desktop window.
export const VIEW_W = 1280;
export const VIEW_H = 800;

// Points and pressure: a find is worth 100 plus a speed bonus, a wrong
// click costs 25 points and 3 seconds, a hint costs 40 points.
export const FIND_POINTS = 100;
export const WRONG_POINTS = 25;
export const WRONG_TIME = 3;
export const HINT_POINTS = 40;
export const HINTS_PER_LEVEL = 3;

// Each scene is a level: more differences, subtler changes, less time.
export const LEVELS = [
  { scene: 'market', name: 'Pasar Malam', diffs: 7, seconds: 120, blurb: 'Malam minggu di pasar — 7 perbedaan bersembunyi di antara lampu lampion.' },
  { scene: 'garden', name: 'Taman Senja', diffs: 8, seconds: 105, blurb: 'Senja di taman bunga — 8 perbedaan, makin halus, makin licik.' },
  { scene: 'warung', name: 'Warung Pagi', diffs: 9, seconds: 90, blurb: 'Pagi di warung kopi — 9 perbedaan. Mata elang atau pulang?' },
];

export const TOTAL_LEVELS = LEVELS.length;

// Colours of the night-market frame, shared by the HUD and the panels.
export const PALETTE = {
  ink: '#1c1430',
  panelEdge: '#3a2b5c',
  cream: '#fff3d6',
  gold: '#f5b942',
  coral: '#ff6b6b',
  teal: '#2ec4b6',
  leaf: '#7bc96f',
};
