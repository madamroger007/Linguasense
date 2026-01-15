import path from 'path';

const PIPER_ROOT = path.resolve(__dirname, '..', '..', 'resources', 'piper');

export const PIPER_CONFIG = {
  binary: path.join(PIPER_ROOT, 'piper'),
  model: path.join(
    PIPER_ROOT,
    'models',
    'en_US-amy-medium.onnx'
  ),
  env: {
    LD_LIBRARY_PATH: PIPER_ROOT,
    ESPEAK_DATA_PATH: path.join(PIPER_ROOT, 'espeak-ng-data'),
  },
};
