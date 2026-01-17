import { ipcMain, BrowserWindow } from 'electron';
import {
  pushAudioChunk,
  consumeAudio,
  isSpeechFinished,
  resetAudioBuffer
} from '../whisper/whisper.stream';
import { transcribePCM } from '../whisper/whisper.service';

let processing = false;
let lastTranscribeAt = 0;

const TRANSCRIBE_COOLDOWN_MS = 1200;

ipcMain.on('audio:chunk', async (_, chunk) => {
  pushAudioChunk(chunk);

  // 🔒 block processing saat AI bicara
  if ((global as any).isAISpeaking) return;

  if (processing) return;
  if (!isSpeechFinished()) return;

  const now = Date.now();
  if (now - lastTranscribeAt < TRANSCRIBE_COOLDOWN_MS) return;

  const audio = consumeAudio();
  if (!audio) return;

  processing = true;
  lastTranscribeAt = now;

  try {
    const text = await transcribePCM(audio);
    if (!text) return;

    BrowserWindow.getAllWindows()[0]
      ?.webContents.send('ai:text', text);
  } finally {
    processing = false;
  }
});

ipcMain.handle('audio:reset', () => {
  resetAudioBuffer();
});
