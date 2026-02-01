import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { WHISPER_CONFIG } from './whisper.config';
import { app } from 'electron';
export async function transcribePCM(
  pcm: Float32Array
): Promise<string> {
  if (!pcm || pcm.length === 0) return '';


  const tempDir = path.join(app.getPath('userData'), 'audio-cache');
  fs.mkdirSync(tempDir, { recursive: true });

  const wavPath = path.join(tempDir, 'input.wav');

  writeWav(wavPath, pcm);

  if (!fs.existsSync(WHISPER_CONFIG.binaryPath)) {
    console.error('[WHISPER] Binary not found:', WHISPER_CONFIG.binaryPath);
    return '';
  }


  return new Promise((resolve, reject) => {
    const p = spawn(
      WHISPER_CONFIG.binaryPath,
      [
        '-m', WHISPER_CONFIG.modelPath,
        '-f', wavPath,
        '--language', WHISPER_CONFIG.language,
        '--no-timestamps',
        '--suppress-nst',
      ],
      { windowsHide: true }
    );

    let out = '';

    p.stdout.on('data', d => {
      out += d.toString();
    });

    p.stderr.on('data', d => {
      console.error('[WHISPER]', d.toString());
    });

    p.on('error', reject);
    p.on('close', () => resolve(out.trim()));
  });
}



function writeWav(file: string, pcm: Float32Array) {
  const sampleRate = 16000;
  const buffer = Buffer.alloc(44 + pcm.length * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + pcm.length * 2, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(pcm.length * 2, 40);

  let offset = 44;
  for (let i = 0; i < pcm.length; i++) {
    const s = Math.max(-1, Math.min(1, pcm[i]));
    buffer.writeInt16LE(s * 32767, offset);
    offset += 2;
  }

  fs.writeFileSync(file, buffer);
}
