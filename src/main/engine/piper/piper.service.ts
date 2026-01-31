import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { PIPER_CONFIG } from './piper.config';

export async function speakWithPiper(
  text: string,
  modelPath: string
): Promise<string> {
  if (!text.trim()) {
    throw new Error('[PIPER] Empty text');
  }

  if (!fs.existsSync(PIPER_CONFIG.binary)) {
    throw new Error(`[PIPER] Binary not found: ${PIPER_CONFIG.binary}`);
  }

  if (!fs.existsSync(modelPath)) {
    throw new Error(`[PIPER] Model file not found: ${modelPath}`);
  }

  const outFile = path.join(
    os.tmpdir(),
    `piper-${Date.now()}.wav`
  );

  return new Promise((resolve, reject) => {
    const p = spawn(
      PIPER_CONFIG.binary,
      [
        '--model', modelPath,
        '--output_file', outFile,
      ],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ...PIPER_CONFIG.env,
        },
      }
    );

    let stderr = '';

    p.stderr.on('data', d => {
      const msg = d.toString();
      stderr += msg;
      console.error('[PIPER]', msg);
    });

    p.stdin.write(text.trim() + '\n');
    p.stdin.end();

    p.on('close', code => {
      if (code === 0 && fs.existsSync(outFile)) {
        resolve(outFile);
      } else {
        reject(
          new Error(
            `[PIPER] Failed (code ${code}): ${stderr || 'no stderr'}`
          )
        );
      }
    });

    p.on('error', reject);
  });
}
