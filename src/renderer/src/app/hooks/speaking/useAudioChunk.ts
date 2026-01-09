import { AudioChunk } from '../../../../../shared/types/audio';

export function startAudioChunking(
  stream: MediaStream,
  onChunk: (chunk: AudioChunk) => void
) {
  const ctx = new AudioContext({ sampleRate: 16000 });
  const source = ctx.createMediaStreamSource(stream);

  // ⚠️ ScriptProcessor deprecated tapi MASIH PALING STABIL di Electron
  const processor = ctx.createScriptProcessor(4096, 1, 1);

  source.connect(processor);
  processor.connect(ctx.destination);

  processor.onaudioprocess = (e) => {
    const pcm = e.inputBuffer.getChannelData(0);

    // 🔍 DEBUG: pastikan ada sinyal
    let energy = 0;
    for (let i = 0; i < pcm.length; i++) {
      energy += Math.abs(pcm[i]);
    }

    if (energy > 0.01) {
      onChunk(new Float32Array(pcm));
    }
  };

  return () => {
    processor.disconnect();
    source.disconnect();
    ctx.close();
  };
}
