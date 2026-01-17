import { getResourcePath } from '../utils/resourcePath';

const isWin = process.platform === 'win32';

export const PIPER_CONFIG = {
  binary: getResourcePath(
    'piper',
    isWin ? 'piper.exe' : 'piper'
  ),

  env: {
    ...(process.platform === 'linux'
      ? {
          LD_LIBRARY_PATH: getResourcePath('piper'),
        }
      : {}),

    ESPEAK_DATA_PATH: getResourcePath(
      'piper',
      'espeak-ng-data'
    ),
  },
};
