import { loadVoices } from './voices';
import { getResourcePath } from '../utils/resourcePath';

export function resolvePiperModel(languageId: string): string {
  const voices = loadVoices();
  const voice = voices[languageId];

  if (!voice) {
    throw new Error(`No Piper voice for language: ${languageId}`);
  }

  const fileRelPath = Object.keys(voice.files)
    .find((f) => f.endsWith('.onnx'));

  if (!fileRelPath) {
    throw new Error(`No .onnx model for language: ${languageId}`);
  }

  // voices.json paths are relative to "voice/"
  return getResourcePath('piper', 'voice', fileRelPath);
}
