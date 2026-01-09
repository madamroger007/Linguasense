import { ipcMain } from 'electron';
import { pushAudioChunk } from '../whisper/whisper.stream';
import { runWhisperOnce } from '../whisper/whisper.service';

ipcMain.on('audio:chunk', async (event, chunk) => {
  pushAudioChunk(chunk);

  const text = await runWhisperOnce();
  if (text) {
    event.sender.send('ai:text', text);
  }
});
