import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { PIPER_CONFIG } from './piper.config';

export async function speakWithPiper(text: string): Promise<string> {
  const outFile = path.join(
    os.tmpdir(),
    `piper-${Date.now()}.wav`
  );

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(PIPER_CONFIG.binary)) {
      return reject(
        new Error(`Piper binary not found: ${PIPER_CONFIG.binary}`)
      );
    }

    const p = spawn(
      PIPER_CONFIG.binary,
      [
        '--model',
        PIPER_CONFIG.model,
        '--output_file',
        outFile,
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

    p.stderr.on('data', (d) => {
      stderr += d.toString();
      console.error('[PIPER]', d.toString());
    });

    // 🔑 WAJIB newline
    p.stdin.write(text.trim() + '\n');
    p.stdin.end();

    p.on('close', (code) => {
      if (code === 0 && fs.existsSync(outFile)) {
        resolve(outFile);
      } else {
        reject(
          new Error(
            `Piper failed (code ${code}): ${stderr || 'no stderr'}`
          )
        );
      }
    });

    p.on('error', (err) => {
      reject(err);
    });
  });
}
