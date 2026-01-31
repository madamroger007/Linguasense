import fs from 'fs';
import path from 'path';
import { getResourcePath } from '../../utils/resourcePath';

type VoiceEntry = {
  files: Record<string, unknown>;
};

const PIPER_ROOT = getResourcePath('piper');

const VOICES_JSON = path.join(
  PIPER_ROOT,
  'voices',
  'voices.json'
);

export function resolveModelPath(lang: string): string {
  if (!fs.existsSync(VOICES_JSON)) {
    throw new Error(`[PIPER] voices.json not found: ${VOICES_JSON}`);
  }

  const voices = JSON.parse(
    fs.readFileSync(VOICES_JSON, 'utf-8')
  ) as Record<string, VoiceEntry>;

  const voice = voices[lang];
  if (!voice) {
    throw new Error(`[PIPER] Voice not found for language: ${lang}`);
  }

  const modelRelPath = Object.keys(voice.files)
    .find(f => f.endsWith('.onnx'));

  if (!modelRelPath) {
    throw new Error(`[PIPER] ONNX model missing for ${lang}`);
  }

  const fullPath = path.join(
    PIPER_ROOT,
    'voices',
    modelRelPath
  );

  if (!fs.existsSync(fullPath)) {
    throw new Error(`[PIPER] Model file not found: ${fullPath}`);
  }

  return fullPath;
}
