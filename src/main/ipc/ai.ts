import { ipcMain } from 'electron';
import { speakWithAI } from '../model';
import fs from 'fs';
import { speakMultilang } from '../piper/piper.multilang.service';
ipcMain.handle('ai:speak', async (_, payload) => {
  return await speakWithAI(payload.provider, payload);
});

ipcMain.handle('ai:tts', async (_, text: string) => {
  const wavPath = await speakMultilang(text);
  const buffer = fs.readFileSync(wavPath);
  return {
    audio: buffer,
    mime: 'audio/wav',
  };
});
