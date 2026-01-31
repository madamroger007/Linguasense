import { clipboard, contextBridge, ipcRenderer } from 'electron';
import { AudioChunk } from '../shared/types/audio';
import { text } from 'stream/consumers';

contextBridge.exposeInMainWorld('audio', {
  sendChunk: (chunk: AudioChunk) =>
    ipcRenderer.send('audio:chunk', chunk),
  resetBuffer: () => ipcRenderer.invoke('audio:reset'),
});

contextBridge.exposeInMainWorld('ai', {
  speak: (payload: any) =>
    ipcRenderer.invoke('ai:speak', payload),

  translate: (payload: any) =>
    ipcRenderer.invoke('ai:translate', payload),
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

contextBridge.exposeInMainWorld('system', {
  onToggleSpeech: (cb: () => void) => {
    ipcRenderer.on('system:toggle-speech', cb);
    return () =>
      ipcRenderer.removeListener('system:toggle-speech', cb);
  },

  onTranslate: (cb: () => void) => {
    ipcRenderer.on('system:translate', cb);
    return () =>
      ipcRenderer.removeListener('system:translate', cb);
  },

  readClipboardText: () => clipboard.readText(),

  writeClipboardText: (text: string) =>
    ipcRenderer.send('system:write-clipboard', text),
  onSetText: (cb: (text: string) => void) => {
    console.log('ini preload handler text', text);
    const listener = (_: unknown, text: string) => {
      console.log('[preload popup] received text:', text);
      cb(text);
    };
    ipcRenderer.on('system:set-text', listener);
    return () => {
      ipcRenderer.removeListener('system:set-text', listener);
    };
  },
});
