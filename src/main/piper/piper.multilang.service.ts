import path from 'path';
import os from 'os';
import fs from 'fs';
import { speakWithPiper } from './piper.service';
import { segmentText } from './text.segmenter';
import { detectLang } from './lang.detect';
import { resolveModelPath } from './voice.map';
import { concatWavPureJS } from './wav.concat';

export async function speakMultilang(
  text: string
): Promise<string> {
  const segments = segmentText(text);
  const wavFiles: string[] = [];

  for (const seg of segments) {
    const lang = await detectLang(seg); // ✅ FIX #1
    const model = resolveModelPath(lang);

    const wav = await speakWithPiper(seg, model);
    wavFiles.push(wav);
  }

  const finalWav = path.join(
    os.tmpdir(),
    `piper-final-${Date.now()}.wav`
  );

  await concatWavPureJS(wavFiles, finalWav);

  // cleanup
  for (const f of wavFiles) {
    fs.unlink(f, () => {});
  }

  return finalWav;
}

