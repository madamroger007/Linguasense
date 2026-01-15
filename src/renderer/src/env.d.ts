/// <reference types="vite/client" />
export { };
declare global {
  interface Window {
    audio: {
      start(): void;
      stop(): void;
      sendChunk(chunk: Float32Array): void;
      resetBuffer(): Promise<void>;
    };
    ai: {
      speak(payload: {
        provider: string;
        model: string;
        language: string;
        message: string;
        apiKey: string;
      }): Promise<string>;

      onWhisperText(cb: (text: string) => void): void;
    };
    tts: {
      speak(text: string): Promise<{
        audio: ArrayBuffer;
        mime: string;
      }>;
    };
  }
}
