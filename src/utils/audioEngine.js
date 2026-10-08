// Web Audio API Synthesizer - 100% Client-Side, No External MP3/CORS issues
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.9;
    this.activeAmbience = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Play Gentle Bell / Chime
  playGentleBell() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      gain.connect(ctx.destination);

      [587.33, 880, 1174.66].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Loud Resounding Temple Bell / Gong
  playTempleBell() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.95, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
      gain.connect(ctx.destination);

      [216, 432, 648, 864, 1296].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 1.5), now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 4.2);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Tibetan Singing Bowl Chime (528 Hz Love/DNA frequency)
  playSingingBowl() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
      gain.connect(ctx.destination);

      [528, 1056, 1584].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 3.8);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // High Electronic Beep
  playElectronicBeep() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.9, now);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1320, now + 0.12);
      osc.connect(gain);
      osc.start(now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Solfeggio frequency tone for Chakras
  playFrequency(freq, duration = 2.5) {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gain);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Frequency play error:', e);
    }
  }

  // Ambient sound generator for Relaxation Zone
  startAmbient(soundId) {
    this.stopAmbient();
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 1.5);
      masterGain.connect(ctx.destination);

      const nodes = [];

      if (soundId === 'om' || soundId === 'meditation') {
        // Deep 136.1 Hz Om Cosmic Vibration with Filter
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(136.1, now);
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, now);
        osc.connect(filter);
        filter.connect(masterGain);
        osc.start(now);
        nodes.push(osc);
      } else if (soundId === 'bowl' || soundId === 'music') {
        // 432 Hz Healing Resonance
        [432, 864].forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          osc.connect(masterGain);
          osc.start(now);
          nodes.push(osc);
        });
      } else if (soundId === 'rain' || soundId === 'sleep') {
        // Soft Zen Rain / White Noise with low-pass filter
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(0.7, now);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start(now);
        nodes.push(whiteNoise);
      }

      this.activeAmbience = { masterGain, nodes };
    } catch (e) {
      console.warn('Ambient error:', e);
    }
  }

  stopAmbient() {
    if (this.activeAmbience && this.ctx) {
      try {
        const { masterGain, nodes } = this.activeAmbience;
        const now = this.ctx.currentTime;
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          nodes.forEach(n => {
            try { n.stop(); } catch (_) {}
          });
        }, 700);
      } catch (_) {}
      this.activeAmbience = null;
    }
  }

  playSoundByType(type) {
    if (type === 'Singing Bowl' || type === 'singing-bowl') {
      this.playSingingBowl();
    } else if (type === 'Temple Bell' || type === 'temple-bell' || type === 'Loud Bell') {
      this.playTempleBell();
    } else if (type === 'Electronic Beep' || type === 'electronic-beep') {
      this.playElectronicBeep();
    } else {
      this.playGentleBell();
    }
  }
}

export const audioEngine = new SoundEngine();
