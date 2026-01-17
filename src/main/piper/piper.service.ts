import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { PIPER_CONFIG } from './piper.config';
import { resolvePiperModel } from './resolvePiperModel';

export async function speakWithPiper(
  text: string,
  baseLanguage: string
): Promise<string> {
  const modelPath = resolvePiperModel(baseLanguage);

  if (!fs.existsSync(PIPER_CONFIG.binary)) {
    throw new Error(`Piper binary not found: ${PIPER_CONFIG.binary}`);
  }

  if (!fs.existsSync(modelPath)) {
    throw new Error(`Piper model not found: ${modelPath}`);
  }

  const outFile = path.join(
    os.tmpdir(),
    `piper-${Date.now()}.wav`
  );

  return new Promise((resolve, reject) => {
    const p = spawn(
      PIPER_CONFIG.binary,
      [
        '--model',
        modelPath,
        '--output_file',
        outFile,
      ],
      {
        env: {
          ...process.env,
          ...PIPER_CONFIG.env,
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      }
    );

    let stderr = '';

    p.stderr.on('data', (d) => {
      stderr += d.toString();
      console.error('[PIPER]', d.toString());
    });

    p.stdin.write(text.trim() + '\n');
    p.stdin.end();

    p.on('close', (code) => {
      if (code === 0 && fs.existsSync(outFile)) {
        resolve(outFile);
      } else {
        reject(
          new Error(
            `Piper failed (code=${code}): ${stderr || 'no stderr'}`
          )
        );
      }
    });

    p.on('error', reject);
  });
}
