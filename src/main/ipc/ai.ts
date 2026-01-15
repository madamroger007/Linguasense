import { ipcMain } from 'electron';
import { speakWithAI } from '../model';

ipcMain.handle('ai:speak', async (_, payload) => {
  return await speakWithAI(payload.provider, payload);
});

