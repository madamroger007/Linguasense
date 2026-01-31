import path from 'path';
import { getResourcePath } from '../../utils/resourcePath';

const PIPER_ROOT = getResourcePath('piper');

export const PIPER_CONFIG = {
  root: PIPER_ROOT,

  binary: path.join(
    PIPER_ROOT,
    process.platform === 'win32' ? 'piper.exe' : 'piper'
  ),

  env: {
    LD_LIBRARY_PATH: PIPER_ROOT,
    ESPEAK_DATA_PATH: path.join(PIPER_ROOT, 'espeak-ng-data'),
  },
};
