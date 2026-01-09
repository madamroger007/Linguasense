import { AudioChunk } from '../../shared/types/audio';

let buffer: Float32Array[] = [];

export function pushAudioChunk(chunk: AudioChunk) {
  buffer.push(chunk);

  // keep ~1.5s audio max
  if (buffer.length > 30) buffer.shift();
}

export function consumeAudio(): Float32Array {
  const merged = Float32Array.from(
    buffer.flatMap(b => Array.from(b))
  );
  buffer = [];
  return merged;
}
