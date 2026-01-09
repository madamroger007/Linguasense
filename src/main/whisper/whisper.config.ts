import path from 'path';

const WHISPER_ROOT =
  process.env.WHISPER_PATH ||
  'D:/App/whisper-bin-x64/Release'; // fallback dev only

export const WHISPER_CONFIG = {
  binaryPath: path.join(
    WHISPER_ROOT,
    'whisper-cli.exe'
  ),

  modelPath: path.join(
    WHISPER_ROOT,
    'models',
    'ggml-base.bin'
  ),

  language: 'auto',
  sampleRate: 16000,
};
