import fs from 'fs';
import path from 'path';

const VOICES_JSON = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'piper',
  'voices',
  'voices.json'
);

const PIPER_ROOT = path.resolve(
  __dirname,
  '..',
  '..',
  'resources',
  'piper'
);

type VoiceEntry = {
  files: Record<string, unknown>;
};

export function resolveModelPath(lang: string): string {
  const voices = JSON.parse(
    fs.readFileSync(VOICES_JSON, 'utf-8')
  ) as Record<string, VoiceEntry>;

  const voice = voices[lang];
  if (!voice) {
    throw new Error(`Voice not found for language: ${lang}`);
  }

  const modelRelPath = Object.keys(voice.files)
    .find((f) => f.endsWith('.onnx'));

  if (!modelRelPath) {
    throw new Error(`ONNX model missing for ${lang}`);
  }

  const fullPath = path.join(PIPER_ROOT, 'voices', modelRelPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Model file not found: ${fullPath}`);
  }

  return fullPath;
}
