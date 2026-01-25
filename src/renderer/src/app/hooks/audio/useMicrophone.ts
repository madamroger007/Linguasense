export async function getMicrophoneStream() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  console.log('[MIC]', stream.getAudioTracks());
  return navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
    },
  });
}
