import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../../state/SettingsContext';
import { useSpeaking } from '../../state/SpeakingContext';
import { speakingPrompt } from '../../../../../shared/model/prompts/speaking';
import { getMicrophoneStream } from './useMicrophone';
import { startAudioChunking } from './useAudioChunk';
import { playTTS } from '../../../utils/text_speech';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export function useRealtimeSpeaking() {
  const { aiProvider, aiModel, speakingLanguage, APIKey, baseLanguage} = useSettings();
  const { store, dispatch } = useSpeaking();

  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: speakingPrompt(speakingLanguage, baseLanguage) },
  ]);

  const stopChunkingRef = useRef<null | (() => void)>(null);
  const isMountedRef = useRef(true);

  const listening = store.state === 'listening';
  // reset greeting on language change
  useEffect(() => {
    setMessages([{ role: 'ai', content: speakingPrompt(speakingLanguage, baseLanguage) }]);
  }, [speakingLanguage]);

  // =========================
  // STOP MIC (hard stop)
  // =========================
  const stopMic = useCallback(() => {
    stopChunkingRef.current?.();
    stopChunkingRef.current = null;
    window.audio.stop();
  }, []);

  // =========================
  // START MIC
  // =========================
  const startMic = useCallback(async () => {
    const stream = await getMicrophoneStream();

    stopChunkingRef.current = startAudioChunking(stream, (chunk) => {
      window.audio.sendChunk(chunk);
    });

    window.audio.start();
  }, []);

  // =========================
  // HANDLE WHISPER RESULT
  // =========================
  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (!spokenText || !isMountedRef.current) return;

      // 🔒 STOP MIC SEBELUM PROSES
      stopMic();
      dispatch({ type: 'PROCESSING' });
      dispatch({ type: 'SET_LOADING', value: true });

      setMessages((prev) => [...prev, { role: 'user', content: spokenText }]);

      try {
        // AI text
        const reply = await window.ai.speak({
          provider: aiProvider,
          model: aiModel,
          language: speakingLanguage,
          message: spokenText,
          apiKey: APIKey,
        });

        if (!isMountedRef.current) return;

        setMessages((prev) => [...prev, { role: 'ai', content: reply }]);

        // 🔊 AI SPEAKING
        dispatch({ type: 'AI_START' });
        (globalThis as any).isAISpeaking = true;

        await window.audio.resetBuffer();
        await playTTS(reply, baseLanguage);

        // 🔓 AI DONE → MIC ON AGAIN
        (globalThis as any).isAISpeaking = false;
        await window.audio.resetBuffer();

        dispatch({ type: 'AI_END' });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'ERROR' });
      }
    },
    [aiProvider, aiModel, speakingLanguage, APIKey, stopMic, dispatch]
  );

  // =========================
  // STATE → SIDE EFFECT
  // =========================
  useEffect(() => {
    if (store.state === 'listening') {
      window.ai.onWhisperText(handleWhisperText);
      startMic();
    }

    if (store.state === 'idle' || store.state === 'processing' || store.state === 'ai_speaking') {
      stopMic();
    }
  }, [store.state, startMic, stopMic, handleWhisperText]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stopMic();
    };
  }, [stopMic]);

  return {
    start: () => dispatch({ type: 'START' }),
    stop: () => dispatch({ type: 'STOP' }),
    listening,
    messages
  };
}
