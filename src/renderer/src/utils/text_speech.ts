let currentAudio: HTMLAudioElement | null = null;

export async function playTTS(text: string): Promise<void> {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }

  const { audio, mime } = await window.ai.tts(text);

  const blob = new Blob([new Uint8Array(audio)], { type: mime });
  const url = URL.createObjectURL(blob);

  const audioEl = new Audio(url);
  currentAudio = audioEl;

  audioEl.onended = () => {
    URL.revokeObjectURL(url);
    if (currentAudio === audioEl) {
      currentAudio = null;
    }
  };

  audioEl.onerror = () => {
    URL.revokeObjectURL(url);
    if (currentAudio === audioEl) {
      currentAudio = null;
    }
  };

  await audioEl.play();
}

export function stopTTS() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
}
