import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '../../provider/SettingsProvider';
import { useSpeaking } from '../../provider/SpeakingProvider';
import { getMicrophoneStream } from '../audio/useMicrophone';
import { startAudioChunking } from '../audio/useAudioChunk';
import { playTTS, stopTTS } from '../../../utils/text_speech';
import { mapError } from '@renderer/utils/error';
import { setGlobalError } from '@renderer/app/store/error';
import { useSystem } from '@renderer/app/provider/SystemProvider';

export function useRealtimeSpeaking() {
  const { state: settings } = useSettings();
  const { store, dispatch } = useSpeaking();
  const { state: system } = useSystem();

  const micActiveRef = useRef(false);
  const startingRef = useRef(false);
  const cancelledRef = useRef(false);
  const stopChunkingRef = useRef<null | (() => void)>(null);

  const startMic = useCallback(async () => {
    if (
      micActiveRef.current ||
      startingRef.current ||
      cancelledRef.current
    ) {
      return;
    }

    startingRef.current = true;

    try {
      const stream = await getMicrophoneStream();
      if (cancelledRef.current) return;
      stopChunkingRef.current = startAudioChunking(stream, chunk => {
        window.audio.sendChunk(chunk);
      });

      micActiveRef.current = true;
      console.log('[mic] started');
    } catch (err) {
      const appError = mapError(err);
      setGlobalError(appError);
    } finally {
      startingRef.current = false;
    }
  }, []);

  const stopMic = useCallback(() => {
    cancelledRef.current = true;
    startingRef.current = false;

    if (!micActiveRef.current) return;

    stopChunkingRef.current?.();
    stopChunkingRef.current = null;

    window.ai.stopTTS();
    stopTTS();

    micActiveRef.current = false;
    console.log('[mic] stopped');
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    if (system.speechActive) {
      startMic();
    } else {
      stopMic();
    }

    return () => {
      cancelledRef.current = true;
      stopMic();
    };
  }, [system.speechActive, startMic, stopMic]);

  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (!spokenText || !system.speechActive || cancelledRef.current) return;

      dispatch({ type: 'PROCESSING' });

      try {
        dispatch({
          type: 'MESSAGES',
          message: { role: 'user', content: spokenText },
        });

        const reply = await window.ai.speak({
          provider: settings.aiProvider,
          request: {
            model: settings.aiModel,
            language: store.language,
            message: spokenText,
            apiKey: settings.apiKey,
            url: settings.url,
          },
        });

        dispatch({
          type: 'MESSAGES',
          message: { role: 'ai', content: reply },
        });

        dispatch({ type: 'AI_START' });

        await window.audio.resetBuffer();
        await playTTS(reply);
        await window.audio.resetBuffer();

        dispatch({ type: 'AI_END' });

        // 🔊 resume mic if still active
        if (system.speechActive && !cancelledRef.current) {
          startMic();
        }

      } catch (err) {
        const appError = mapError(err);
        setGlobalError(appError);
      }
    },
    [
      settings.aiProvider,
      settings.aiModel,
      settings.apiKey,
      settings.url,
      store.language,
      system.speechActive,
      dispatch,
      startMic,
      stopMic,
    ]
  );

  useEffect(() => {
    if (!system.speechActive) return;

    const unsubscribe = window.ai.onWhisperText(handleWhisperText);
    return () => {
      unsubscribe?.();
    };
  }, [handleWhisperText, system.speechActive]);

  return null;
}
