import { useRealtimeSpeaking } from '../speaking/useRealtimeSpeaking';

export function SystemSpeechRuntime() {
  useRealtimeSpeaking();
  return null;
}
