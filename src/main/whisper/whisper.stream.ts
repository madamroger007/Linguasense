import { AudioChunk } from '../../shared/types/audio';

let buffer: Float32Array[] = [];
let lastSoundAt = 0;
let hasSpeech = false;

const SILENCE_THRESHOLD = 0.015; // lebih ketat
const SILENCE_TIMEOUT_MS = 900;

// =========================
// PUSH AUDIO
// =========================
export function pushAudioChunk(chunk: AudioChunk) {
  buffer.push(chunk);

  // hitung energi
  let energy = 0;
  for (let i = 0; i < chunk.length; i++) {
    energy += Math.abs(chunk[i]);
  }
  energy /= chunk.length;

  if (energy > SILENCE_THRESHOLD) {
    lastSoundAt = Date.now();
    hasSpeech = true;
  }

  if (buffer.length > 120) buffer.shift(); // ~7s
}

// =========================
// CHECK FINISHED
// =========================
export function isSpeechFinished(): boolean {
  if (!hasSpeech) return false;
  return Date.now() - lastSoundAt > SILENCE_TIMEOUT_MS;
}

// =========================
// NORMALIZE
// =========================
function normalize(input: Float32Array): Float32Array {
  let max = 0;
  for (let i = 0; i < input.length; i++) {
    max = Math.max(max, Math.abs(input[i]));
  }
  if (max < 1e-4) return input;

  const gain = 0.8 / max;
  return Float32Array.from(input, v => v * gain);
}

// =========================
// CONSUME (SAFE)
// =========================
export function consumeAudio(): Float32Array | null {
  if (!hasSpeech) return null;

  const totalSamples = buffer.reduce((s, b) => s + b.length, 0);

  if (totalSamples < 16000 * 1.5) {
    return null;
  }

  const merged = new Float32Array(totalSamples);
  let offset = 0;
  for (const b of buffer) {
    merged.set(b, offset);
    offset += b.length;
  }

  buffer = [];
  hasSpeech = false;
  lastSoundAt = 0;

  return normalize(merged);
}

export function resetAudioBuffer() {
  buffer = [];
  lastSoundAt = Date.now();
}
