// Web Audio API Synthesizer - 100% Client-Side, No External MP3/CORS issues
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.85;
    this.activeAmbience = null;
    this.activeAudio = null;
    this.activeAlarmOscillators = [];
    this.activeAlarmGains = [];
    this.activeAlarmTimeouts = [];
    this.isAlarmRinging = false;
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
    if (this.activeAudio) {
      this.activeAudio.volume = this.volume;
    }
    if (this.activeAmbience && this.activeAmbience.masterGain && this.ctx) {
      try {
        this.activeAmbience.masterGain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
      } catch (_) {}
    }
  }

  // Solfeggio / Chakra Tone Synthesizer (e.g. 528 Hz Heart Tone, 432 Hz Healing Tone)
  playChakraTone(freq = 528, duration = 3.8) {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(this.volume * 0.75, now + 0.35);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      masterGain.connect(ctx.destination);

      // Warm solfeggio harmonic layering (Fundamental + 5th harmonic overtone)
      [
        { f: freq, weight: 0.8 },
        { f: freq * 1.5, weight: 0.22 },
        { f: freq * 2, weight: 0.1 }
      ].forEach(({ f, weight }) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(weight, now);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('playChakraTone error:', e);
    }
  }

  // 1. Soft Bell - Warm, peaceful harmonic bell
  playSoftBell() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);
      gain.connect(ctx.destination);

      // C major triad harmonic frequencies
      [523.25, 659.25, 783.99, 1046.50].forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 2.8);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 2. Gentle Chime - Shimmering wind chime sequence
  playGentleChime() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const freqs = [880, 1174.66, 1318.51, 1760];
      freqs.forEach((freq, idx) => {
        const delay = idx * 0.09;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.65, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.0);
        gain.connect(ctx.destination);

        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.connect(gain);
        osc.start(now + delay);
        osc.stop(now + delay + 2.0);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 3. Peaceful Nature - Calming natural ambient harmonic
  playPeacefulNature() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
      gain.connect(ctx.destination);

      // Earth frequency 432 Hz + gentle flowing harmonics
      [432, 648, 864].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 0.8), now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 4. Meditation Tone - Deep Tibetan singing bowl / 136.1 Hz Om vibration
  playMeditationTone() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.volume * 0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
      gain.connect(ctx.destination);

      // 136.1 Hz Om frequency & overtones
      [136.1, 272.2, 544.4, 1088.8].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (idx * 1.2), now);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 4.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Legacy mappings
  playGentleBell() {
    this.playSoftBell();
  }

  playTempleBell() {
    this.playMeditationTone();
  }

  playSingingBowl() {
    this.playMeditationTone();
  }

  playTibetanSingingBowl() {
    this.playMeditationTone();
  }

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

  // Play by sound name (The 4 built-in sounds + legacy names)
  playSoundByName(type) {
    switch (type) {
      case 'Gentle Chime':
        this.playGentleChime();
        break;
      case 'Peaceful Nature':
        this.playPeacefulNature();
        break;
      case 'Meditation Tone':
      case 'Singing Bowl':
      case 'Temple Bell':
      case 'Temple Gong':
      case 'Chakra Tone':
        this.playMeditationTone();
        break;
      case 'Soft Bell':
      case 'Gentle Bell':
      default:
        this.playSoftBell();
        break;
    }
  }

  playSoundByType(type) {
    this.playSoundByName(type);
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
      masterGain.gain.exponentialRampToValueAtTime(this.volume * 0.4, now + 1.5);
      masterGain.connect(ctx.destination);

      const nodes = [];

      if (soundId === 'om' || soundId === 'meditation' || soundId === 'Meditation') {
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
      } else if (soundId === 'bowl' || soundId === 'music' || soundId === 'Breathing') {
        [432, 864].forEach(f => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          osc.connect(masterGain);
          osc.start(now);
          nodes.push(osc);
        });
      } else {
        // Sleep or gentle rain
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
        filter.frequency.setValueAtTime(650, now);
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
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          nodes.forEach(n => {
            try { n.stop(); } catch (_) {}
          });
        }, 600);
      } catch (_) {}
      this.activeAmbience = null;
    }
    this.stopAudioFile();
  }

  stopAllAmbient() {
    this.stopAmbient();
  }

  // Play audio file (data URL or external URL)
  playAudioFile(src, onEnded) {
    this.stopAudioFile();
    try {
      const audio = new Audio(src);
      audio.volume = this.volume;
      audio.onended = () => {
        if (onEnded) onEnded();
      };
      audio.play().catch(err => {
        console.warn('HTML5 Audio playback error:', err);
      });
      this.activeAudio = audio;
      return audio;
    } catch (e) {
      console.warn('Cannot play audio source:', e);
      return null;
    }
  }

  stopAudioFile() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (_) {}
      this.activeAudio = null;
    }
  }

  pauseAudioFile() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
      } catch (_) {}
    }
  }

  // 5. Alarm Chime - Distinct Repeating Alert Chime for Reminders (Fully Tracked)
  playAlarmChime() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      this.isAlarmRinging = true;
      const now = ctx.currentTime;

      [0, 0.25, 0.50, 0.90, 1.15, 1.40].forEach((timeOffset, idx) => {
        const freq = (idx % 3 === 0) ? 659.25 : (idx % 3 === 1) ? 880 : 1318.51;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.volume * 0.9, now + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.42);
        gain.connect(ctx.destination);
        this.activeAlarmGains.push(gain);

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + timeOffset);
        osc.connect(gain);
        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + 0.42);

        this.activeAlarmOscillators.push(osc);

        osc.onended = () => {
          this.activeAlarmOscillators = this.activeAlarmOscillators.filter(o => o !== osc);
          this.activeAlarmGains = this.activeAlarmGains.filter(g => g !== gain);
          try { osc.disconnect(); } catch (_) {}
          try { gain.disconnect(); } catch (_) {}
        };
      });
    } catch (e) {
      console.warn('Alarm chime error:', e);
    }
  }

  // CRITICAL REQUIREMENT: Stop all alarm audio, pause elements, reset playback, cancel callbacks
  stopAlarmSound() {
    this.isAlarmRinging = false;

    // 1. Stop and disconnect every active oscillator immediately
    if (this.activeAlarmOscillators && this.activeAlarmOscillators.length > 0) {
      this.activeAlarmOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (_) {}
      });
      this.activeAlarmOscillators = [];
    }

    // 2. Silence and disconnect all active gain nodes
    if (this.activeAlarmGains && this.activeAlarmGains.length > 0) {
      this.activeAlarmGains.forEach(gain => {
        try {
          if (this.ctx) gain.gain.setValueAtTime(0, this.ctx.currentTime);
          gain.disconnect();
        } catch (_) {}
      });
      this.activeAlarmGains = [];
    }

    // 3. Clear all pending timeouts
    if (this.activeAlarmTimeouts && this.activeAlarmTimeouts.length > 0) {
      this.activeAlarmTimeouts.forEach(tId => clearTimeout(tId));
      this.activeAlarmTimeouts = [];
    }

    // 4. Pause and reset any active HTML5 audio element
    this.stopAudioFile();
  }

  // Pre-unlock AudioContext on first touch / click across the app
  unlockAudio() {
    const unlock = () => {
      this.init();
      if (typeof window !== 'undefined') {
        window.removeEventListener('click', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('keydown', unlock);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    }
  }
}

export const audioEngine = new SoundEngine();
audioEngine.unlockAudio();

export const BUILT_IN_SOUNDS = [
  { id: 'Soft Bell', name: 'Soft Bell', nameTa: 'மெல்லிய மணி', desc: 'Warm harmonic bell' },
  { id: 'Gentle Chime', name: 'Gentle Chime', nameTa: 'மென்மையான ஓசை', desc: 'Soothing wind chime triad' },
  { id: 'Peaceful Nature', name: 'Peaceful Nature', nameTa: 'அமைதியான இயற்கை', desc: 'Calming 432 Hz resonance' },
  { id: 'Meditation Tone', name: 'Meditation Tone', nameTa: 'தியான ஒலி', desc: 'Tibetan singing bowl & Om' }
];
