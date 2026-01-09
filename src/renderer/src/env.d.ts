/// <reference types="vite/client" />
export {};
interface Window {
  ai: {
    speak(payload: {
      provider: string;
      model: string;
      language: string;
      message: string;
    }): Promise<string>;
  };
}

declare global {
  interface Window {
    audio: {
      start(): void;
      stop(): void;
      sendChunk(chunk: Float32Array): void;
    };
    ai: {
      speak(payload: {
        provider: string;
        model: string;
        language: string;
        message: string;
      }): Promise<string>;

      onWhisperText(cb: (text: string) => void): void;
    };
  }
}
