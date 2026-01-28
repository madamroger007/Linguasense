import path from 'path';
import os from 'os';
import fs from 'fs';
import { speakWithPiper } from './piper.service';
import { segmentText } from './text.segmenter';
import { detectLang } from './lang.detect';
import { resolveModelPath } from './voice.map';
import { concatWavPureJS } from './wav.concat';

export async function speakMultilang(
  text: string,
  options?: { signal?: AbortSignal }
): Promise<string> {
  const signal = options?.signal;

  const segments = segmentText(text);
  const wavFiles: string[] = [];

  // helper abort check
  const checkAbort = () => {
    if (signal?.aborted) {
      throw new Error('TTS_ABORTED');
    }
  };

  try {
    checkAbort();

    for (const seg of segments) {
      checkAbort();

      const lang = await detectLang(seg);
      checkAbort();

      const model = resolveModelPath(lang);
      checkAbort();

      const wav = await speakWithPiper(seg, model);
      checkAbort();

      wavFiles.push(wav);
    }

    checkAbort();

    const finalWav = path.join(
      os.tmpdir(),
      `piper-final-${Date.now()}.wav`
    );

    await concatWavPureJS(wavFiles, finalWav);
    checkAbort();

    return finalWav;
  } catch (err) {
    // ⛔ abort = normal flow, not error
    if (signal?.aborted) {
      console.log('[speakMultilang] aborted');
    } else {
      console.error('[speakMultilang] error', err);
    }
    throw err;
  } finally {
    // 🧹 cleanup temp wav files
    for (const f of wavFiles) {
      fs.unlink(f, () => {});
    }
  }
}
