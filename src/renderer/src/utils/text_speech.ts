export function playTTS(text: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const { audio, mime } = await window.ai.tts(text);

      const blob = new Blob([new Uint8Array(audio)], { type: mime });
      const url = URL.createObjectURL(blob);

      const audioEl = new Audio(url);

      audioEl.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };

      audioEl.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      await audioEl.play();
    } catch (err) {
      reject(err);
    }
  });
}
