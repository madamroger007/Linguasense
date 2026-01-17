export function playTTS(text: string, baseLanguage: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const { audio, mime } = await window.tts.speak(text, baseLanguage);

      const blob = new Blob([new Uint8Array(audio)], { type: mime });
      const url = URL.createObjectURL(blob);

      const audioEl = new Audio(url);

      audioEl.onended = () => {
        URL.revokeObjectURL(url);
        resolve(); // ✅ BARU SELESAI DI SINI
      };

      audioEl.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      await audioEl.play(); // hanya start
    } catch (err) {
      reject(err);
    }
  });
}
