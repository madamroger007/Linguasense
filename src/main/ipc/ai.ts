import { ipcMain } from 'electron';
import { speakWithAI } from '../engine/provider';
import fs from 'fs';
import { speakMultilang } from '../engine/piper/piper.multilang.service';
import { speakingPrompt } from '../../shared/model/prompts/speaking';

let abortController: AbortController | null = null;
ipcMain.handle('ai:speak', async (_, payload) => {
  try {
    return await speakWithAI(payload, speakingPrompt(payload.request.language));
  } catch (err) {
    console.error('ai:speak failed', err);
    throw err;
  }
});

ipcMain.handle('ai:tts', async (_, text: string) => {

  if (abortController) {
    abortController.abort();
    abortController = null;
  }

  abortController = new AbortController();
  const signal = abortController.signal;

  try {
    const wavPath = await speakMultilang(text, { signal });

    if (signal.aborted) {
      throw new Error('TTS aborted');
    }

    const buffer = fs.readFileSync(wavPath);

    return {
      audio: buffer,
      mime: 'audio/wav',
    };
  } catch (err) {
    console.error('ai:tts failed', err);

    if (signal.aborted) {
      return null;
    }
    throw err;
  }
});

ipcMain.on('ai:tts:stop', () => {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
});
