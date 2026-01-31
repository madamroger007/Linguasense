/// <reference types="vite/client" />

import { get } from "http";

export { };
declare global {
  interface Window {
    audio: {
      sendChunk(chunk: Float32Array): void;
      resetBuffer(): Promise<void>;
    };
    ai: {
      speak(payload: {
        provider: string;
        request: {
          model: string;
          language: string;
          message: string;
          apiKey: string;
          url: string;
        };
      }): Promise<string>;

      translate(payload: {
        provider: string;
        request: {
          model: string;
          language: string;
          message: string;
          apiKey: string;
          url: string;
        };
      }): Promise<string>;

      onWhisperText(cb: (text: string) => void): () => void;

      tts(text: string): Promise<{
        audio: ArrayBuffer;
        mime: string;
      }>;
      stopTTS(): void;
    };
    system: {
      onToggleSpeech: (cb: () => void) => () => void;
      onTranslate: (cb: () => void) => () => void;
      readClipboardText: () => string;
      writeClipboardText: (text: string) => void;
      onSetText: (cb: (text: string) => void) => () => void;
    };
  }
}
