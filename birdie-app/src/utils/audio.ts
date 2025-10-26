class AudioManager {
  private audioContext: AudioContext | null = null;
  private isMuted = false;

  constructor() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // Play a simple synthesized whoosh sound
  playWhoosh() {
    if (this.isMuted || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create oscillator for whoosh effect
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Whoosh sound: descending frequency
    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.3);

    // Fade out
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  // Play a simple bird chirp sound
  playChirp() {
    if (this.isMuted || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Create two oscillators for a chirp effect
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Chirp: quick rising frequency
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.1);

    osc2.frequency.setValueAtTime(1200, now);
    osc2.frequency.exponentialRampToValueAtTime(2000, now + 0.1);

    // Quick fade
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.1);
    osc2.stop(now + 0.1);
  }

  // Play correct answer sound
  playCorrect() {
    if (this.isMuted || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Happy ascending tone
    osc.frequency.setValueAtTime(523, now); // C5
    osc.frequency.setValueAtTime(659, now + 0.1); // E5
    osc.frequency.setValueAtTime(784, now + 0.2); // G5

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Play wrong answer sound
  playWrong() {
    if (this.isMuted || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Gentle descending tone
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Play perfect set celebration sound
  playPerfect() {
    if (this.isMuted || !this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Play a triumphant sequence
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const startTime = now + i * 0.15;
      osc.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Play ambient bird sounds (background)
  playAmbient() {
    if (this.isMuted || !this.audioContext) return;

    // Random chirps at intervals
    const playRandomChirp = () => {
      if (!this.isMuted) {
        this.playChirp();
        const nextDelay = 2000 + Math.random() * 4000; // 2-6 seconds
        setTimeout(playRandomChirp, nextDelay);
      }
    };

    setTimeout(playRandomChirp, 1000 + Math.random() * 2000);
  }
}

export const audioManager = new AudioManager();
