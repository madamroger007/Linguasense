import fs from 'fs';
import { getResourcePath } from '../utils/resourcePath';

export type PiperVoiceEntry = {
  key: string;
  name: string;
  files: Record<string, unknown>;
};

export type VoicesMap = Record<string, PiperVoiceEntry>;

let cache: VoicesMap | undefined;

export function loadVoices(): VoicesMap {
  if (cache !== undefined) {
    return cache;
  }

  const voicesPath = getResourcePath('piper','voice' ,'voices.json');

  if (!fs.existsSync(voicesPath)) {
    throw new Error(`voices.json not found at ${voicesPath}`);
  }

  const raw = fs.readFileSync(voicesPath, 'utf-8');

  const parsed = JSON.parse(raw) as VoicesMap;

  cache = parsed;
  return parsed;
}
