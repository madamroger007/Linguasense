import { getResourcePath } from '../../utils/resourcePath';

const isWin = process.platform === 'win32';

export const WHISPER_CONFIG = {
  binaryPath: getResourcePath(
    'whisper',
    isWin ? 'bin32' : 'bin',
    isWin ? 'whisper-cli.exe' : 'whisper-cli'
  ),

  modelPath: getResourcePath(
    'whisper',
    'models',
    'ggml-large-v3-turbo.bin'
  ),

  language: 'auto',
  sampleRate: 16000,
};
