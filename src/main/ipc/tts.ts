import { ipcMain } from 'electron';
import { speakWithPiper } from '../tts/piper.service';
import fs from 'fs';
ipcMain.handle('tts:speak', async (_, text: string) => {
  const wavPath = await speakWithPiper(text);
  const buffer = fs.readFileSync(wavPath);

  return {
    audio: buffer,
    mime: 'audio/wav',
  };
});

