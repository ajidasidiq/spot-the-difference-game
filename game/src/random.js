// A tiny seeded random generator so every scene paints the same way on
// every run: the two panels must differ only by the differences, never by
// a fresh roll of the dice, and screenshots must be reproducible.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick a stable seed per scene so the stars, stalls and flowers never move
// between the left and right picture of the same level.
export function sceneSeed(scene) {
  let hash = 2166136261;
  for (let i = 0; i < scene.length; i += 1) {
    hash ^= scene.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
