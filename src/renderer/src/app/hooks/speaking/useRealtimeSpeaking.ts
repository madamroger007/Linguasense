import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSpeaking } from '../../context/SpeakingContext';
import { getMicrophoneStream } from '../audio/useMicrophone';
import { startAudioChunking } from '../audio/useAudioChunk';
import { playTTS, stopTTS } from '../../../utils/text_speech';
import { mapError } from '@renderer/utils/error';
import { setGlobalError } from '@renderer/app/reducer/store/error';

export function useRealtimeSpeaking() {
  const { state: stateSettings } = useSettings();
  const { store, dispatch } = useSpeaking();
  const stopChunkingRef = useRef<null | (() => void)>(null);
  const isMicActiveRef = useRef(false);
  const listening = store.state === 'listening';

  const startMic = useCallback(async () => {
    if (isMicActiveRef.current) return;

    const stream = await getMicrophoneStream();

    stopChunkingRef.current = startAudioChunking(stream, (chunk) => {
      window.audio.sendChunk(chunk);
    });

    isMicActiveRef.current = true;
  }, []);

  const stopMic = useCallback(() => {
    if (!isMicActiveRef.current) return;

    stopChunkingRef.current?.();
    stopChunkingRef.current = null;

    window.ai.stopTTS();
    stopTTS();
    isMicActiveRef.current = false;

  }, []);

  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (!spokenText) return;

      dispatch({ type: 'PROCESSING' });

      try {
        dispatch({
          type: 'MESSAGES',
          message: { role: 'user', content: spokenText },
        });

        const reply = await window.ai.speak({
          provider: stateSettings.aiProvider,
          request: {
            model: stateSettings.aiModel,
            language: stateSettings.speakingLanguage,
            message: spokenText,
            apiKey: stateSettings.apiKey,
            url: stateSettings.url,
          }
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

      } catch (err) {
        const appError = mapError(err);
        setGlobalError(appError);
      }
    },
    [stateSettings.aiProvider, stateSettings.aiModel, stateSettings.speakingLanguage, stateSettings.apiKey, stateSettings.url, dispatch]
  );

  useEffect(() => {
    const unsubscribe = window.ai.onWhisperText(handleWhisperText);
    return unsubscribe;
  }, [handleWhisperText]);

  useEffect(() => {
    if (listening) {
      startMic();
    } else {
      stopMic();
    }

    return () => {
      stopMic();
    };
  }, [listening, startMic, stopMic]);

  return {
    start: () => dispatch({ type: 'START' }),
    stop: () => dispatch({ type: 'STOP' }),
    listening,
    messages: store.messages,
  };
}
