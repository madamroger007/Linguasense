import { contextBridge, ipcRenderer } from 'electron';
import { AudioChunk } from '../shared/types/audio';

contextBridge.exposeInMainWorld('audio', {
  sendChunk: (chunk: AudioChunk) =>
    ipcRenderer.send('audio:chunk', chunk),
  resetBuffer: () => ipcRenderer.invoke('audio:reset'),
});

contextBridge.exposeInMainWorld('ai', {
  speak: (payload: any) =>
    ipcRenderer.invoke('ai:speak', payload),

  onWhisperText: (cb: (text: string) => void) => {
    const listener = (_: any, text: string) => cb(text);
    ipcRenderer.on('ai:text', listener);
    return () => {
      ipcRenderer.removeListener('ai:text', listener);
    };
  },

  tts: (text: string, baseLanguage: string) =>
    ipcRenderer.invoke('ai:tts', text, baseLanguage),
  stopTTS: () =>
    ipcRenderer.send('ai:tts:stop'),
});
