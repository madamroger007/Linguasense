import { contextBridge, ipcRenderer } from 'electron';
import { AudioChunk } from '../shared/types/audio';

contextBridge.exposeInMainWorld('audio', {
  start: () => ipcRenderer.send('audio:start'),
  stop: () => ipcRenderer.send('audio:stop'),
  sendChunk: (chunk: AudioChunk) =>
    ipcRenderer.send('audio:chunk', chunk),
});

contextBridge.exposeInMainWorld('ai', {
  speak: (payload: any) =>
    ipcRenderer.invoke('ai:speak', payload),

  onWhisperText: (cb: (text: string) => void) => {
    ipcRenderer.removeAllListeners('ai:text');
    ipcRenderer.on('ai:text', (_, text) => cb(text));
  },
});
