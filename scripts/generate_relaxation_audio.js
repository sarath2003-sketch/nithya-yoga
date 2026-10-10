const fs = require('fs');
const path = require('path');

const audioDir = path.resolve(__dirname, '../assets/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function writeWavFile(filename, durationSec, sampleRate, generatorFn) {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataSize = numSamples * blockAlign;
  const fileSize = 44 + dataSize;
  const buffer = Buffer.alloc(fileSize);

  // RIFF Chunk Descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize - 8, 4);
  buffer.write('WAVE', 8);

  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28); // ByteRate
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const [leftSample, rightSample] = generatorFn(t, i, numSamples);

    // Clamp between -1.0 and 1.0, convert to 16-bit signed integer
    const intL = Math.max(-32767, Math.min(32767, Math.floor(leftSample * 32767)));
    const intR = Math.max(-32767, Math.min(32767, Math.floor(rightSample * 32767)));

    buffer.writeInt16LE(intL, offset);
    buffer.writeInt16LE(intR, offset + 2);
    offset += 4;
  }

  const outPath = path.join(audioDir, filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`✓ Generated ${filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB, ${durationSec}s PCM WAV)`);
}

const SAMPLE_RATE = 44100;
const DURATION = 12; // 12-second seamless loops

// 1. Featured Meditation (136.1 Hz Om vibration + harmonic overtones)
writeWavFile('featured-meditation-om.wav', DURATION, SAMPLE_RATE, (t, i, total) => {
  const env = Math.sin((Math.PI * i) / total); // Smooth envelope
  const om = Math.sin(2 * Math.PI * 136.1 * t) * 0.45;
  const harmonic1 = Math.sin(2 * Math.PI * 272.2 * t) * 0.2;
  const harmonic2 = Math.sin(2 * Math.PI * 408.3 * t) * 0.1;
  const binauralBeatL = Math.sin(2 * Math.PI * (136.1 + 2.5) * t) * 0.15;
  const binauralBeatR = Math.sin(2 * Math.PI * (136.1 - 2.5) * t) * 0.15;

  const left = (om + harmonic1 + harmonic2 + binauralBeatL) * (0.6 + 0.4 * env);
  const right = (om + harmonic1 + harmonic2 + binauralBeatR) * (0.6 + 0.4 * env);
  return [left * 0.7, right * 0.7];
});

// 2. Pranayama (432 Hz Healing Tone + Breath wave)
writeWavFile('pranayama-432hz.wav', DURATION, SAMPLE_RATE, (t, i, total) => {
  const breathCycle = Math.sin((2 * Math.PI * t) / 6); // 6-second breath rise/fall
  const baseAmp = 0.5 + 0.3 * breathCycle;
  const f432 = Math.sin(2 * Math.PI * 432 * t) * 0.4;
  const f864 = Math.sin(2 * Math.PI * 864 * t) * 0.15;
  const f216 = Math.sin(2 * Math.PI * 216 * t) * 0.25;

  const val = (f432 + f864 + f216) * baseAmp;
  return [val * 0.65, val * 0.65];
});

// 3. Singing Bowl (Tibetan resonant singing bowl)
writeWavFile('singing-bowl.wav', DURATION, SAMPLE_RATE, (t, i, total) => {
  const strikeRate = 6;
  const localT = t % strikeRate;
  const decay = Math.exp(-localT * 0.6); // Bell resonance decay
  const fundamental = Math.sin(2 * Math.PI * 528 * localT) * 0.4;
  const overtone1 = Math.sin(2 * Math.PI * 1056 * localT) * 0.25;
  const overtone2 = Math.sin(2 * Math.PI * 1584 * localT) * 0.15;
  const shimmer = Math.sin(2 * Math.PI * 4 * localT) * 0.08;

  const left = (fundamental + overtone1 + overtone2 + shimmer) * decay;
  const right = (fundamental * 0.95 + overtone1 * 1.05 + overtone2 + shimmer) * decay;
  return [left * 0.8, right * 0.8];
});

// 4. Sleep Zen (Rain and ocean wave white/pink noise)
let lastNoiseL = 0;
let lastNoiseR = 0;
writeWavFile('sleep-zen-rain.wav', DURATION, SAMPLE_RATE, (t, i, total) => {
  // Pink-noise filter approximation for gentle rain
  const whiteL = Math.random() * 2 - 1;
  const whiteR = Math.random() * 2 - 1;
  lastNoiseL = (lastNoiseL * 0.95) + (whiteL * 0.05);
  lastNoiseR = (lastNoiseR * 0.95) + (whiteR * 0.05);

  const waveSwell = 0.6 + 0.4 * Math.sin((2 * Math.PI * t) / 4); // 4-second wave swell
  return [lastNoiseL * waveSwell * 0.5, lastNoiseR * waveSwell * 0.5];
});

// 5. Peaceful Mind (Gentle harmonic harp / wind chime drone)
writeWavFile('peaceful-mind.wav', DURATION, SAMPLE_RATE, (t, i, total) => {
  const c5 = Math.sin(2 * Math.PI * 523.25 * t) * 0.25;
  const e5 = Math.sin(2 * Math.PI * 659.25 * t) * 0.2;
  const g5 = Math.sin(2 * Math.PI * 783.99 * t) * 0.2;
  const a5 = Math.sin(2 * Math.PI * 880.00 * t) * 0.15;
  const swell = 0.7 + 0.3 * Math.sin((2 * Math.PI * t) / 3);

  const left = (c5 + g5) * swell * 0.6;
  const right = (e5 + a5) * swell * 0.6;
  return [left, right];
});
