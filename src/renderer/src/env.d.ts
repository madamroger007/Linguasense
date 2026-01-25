/// <reference types="vite/client" />
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

      onWhisperText(cb: (text: string) => void): () => void;

      tts(text: string): Promise<{
        audio: ArrayBuffer;
        mime: string;
      }>;
      stopTTS(): void;
    };
  }
}
