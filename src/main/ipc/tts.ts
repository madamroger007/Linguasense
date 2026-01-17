import { ipcMain } from 'electron';
import { speakWithPiper } from '../piper/piper.service';
import fs from 'fs';
ipcMain.handle('tts:speak', async (_, text: string, baseLanguage: string) => {
  const wavPath = await speakWithPiper(text, baseLanguage);
  const buffer = fs.readFileSync(wavPath);
  console.log('test ini apakah kosong', text, baseLanguage)
  return {
    audio: buffer,
    mime: 'audio/wav',
  };
});

