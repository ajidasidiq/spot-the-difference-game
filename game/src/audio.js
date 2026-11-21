// All sound is synthesized with WebAudio: no audio files, no network.
// A find rings a bright two-note chime, a miss buzzes low, a hint pings,
// a win plays a little arpeggio and the last ten seconds tick.
export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, start, length, type, gain) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    amp.gain.setValueAtTime(0.0001, now);
    amp.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(amp);
    amp.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + length + 0.05);
  }

  found() {
    this.ensure();
    this.tone(660, 0, 0.16, 'sine', 0.22);
    this.tone(990, 0.09, 0.28, 'sine', 0.2);
  }

  wrong() {
    this.ensure();
    this.tone(140, 0, 0.22, 'sawtooth', 0.1);
    this.tone(110, 0.05, 0.25, 'sawtooth', 0.08);
  }

  hint() {
    this.ensure();
    this.tone(1180, 0, 0.12, 'triangle', 0.14);
    this.tone(1560, 0.08, 0.18, 'triangle', 0.12);
  }

  levelClear() {
    this.ensure();
    [523, 659, 784, 1046].forEach((freq, i) => this.tone(freq, i * 0.11, 0.3, 'triangle', 0.18));
  }

  gameOver() {
    this.ensure();
    [392, 330, 262].forEach((freq, i) => this.tone(freq, i * 0.16, 0.32, 'sine', 0.16));
  }

  tick() {
    this.ensure();
    this.tone(880, 0, 0.06, 'square', 0.05);
  }
}
