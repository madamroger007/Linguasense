import path from 'path';

const WHISPER_ROOT =
  path.resolve(__dirname, '..', '..', 'resources', 'whisper');

export const WHISPER_CONFIG = {
  binaryPath: path.join(
    WHISPER_ROOT,
    'bin',
    'whisper-cli'
  ),

  modelPath: path.join(
    WHISPER_ROOT,
    'models',
    'ggml-small.bin'
  ),

  language: 'auto',
  sampleRate: 16000,
};
