import { ipcMain } from 'electron';
import { speakWithAI } from '../engine/provider';
import fs from 'fs';
import { speakMultilang } from '../engine/piper/piper.multilang.service';
import { speakingPrompt } from '../../shared/model/prompts/speaking';
import { TranslatePrompt } from '../../shared/model/prompts/translate';

let abortController: AbortController | null = null;
ipcMain.handle('ai:speak', async (_, payload) => {
  return await speakWithAI(payload, speakingPrompt(payload.request.language));
});

ipcMain.handle('ai:translate', async (_, payload) => {
  return await speakWithAI(
    payload,
    TranslatePrompt(payload.request.message, payload.request.language)
  );
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
