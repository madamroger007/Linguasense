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
  const {
    aiProvider,
    aiModel,
    speakingLanguage,
    APIKey,
  } = useSettings();

  const { store, dispatch } = useSpeaking();

  const stopChunkingRef = useRef<null | (() => void)>(null);
  const micRunningRef = useRef(false);
  const handlingRef = useRef(false);
  const mountedRef = useRef(true);

  const listening = store.state === 'listening';

  const startMic = useCallback(async () => {
    if (micRunningRef.current) return;

    micRunningRef.current = true;
    const stream = await getMicrophoneStream();

    stopChunkingRef.current = startAudioChunking(stream, (chunk) => {
      window.audio.sendChunk(chunk);
    });

    window.audio.start();
  }, []);

  const stopMic = useCallback(() => {
    if (!micRunningRef.current) return;

    micRunningRef.current = false;
    stopChunkingRef.current?.();
    stopChunkingRef.current = null;

    window.audio.stop();
  }, []);

  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (
        !spokenText ||
        handlingRef.current ||
        !mountedRef.current
      ) {
        return;
      }

      handlingRef.current = true;
      stopMic();
      dispatch({ type: 'PROCESSING' });

      try {
        dispatch({
          type: "MESSAGES",
          message: { role: 'user', content: spokenText }
        });

        const reply = await window.ai.speak({
          provider: aiProvider,
          model: aiModel,
          language: speakingLanguage,
          message: spokenText,
          apiKey: APIKey,
        });

        if (!mountedRef.current) return;

        dispatch({
          type: "MESSAGES",
          message: { role: 'ai', content: reply }
        });

        dispatch({ type: 'AI_START' });

        await window.audio.resetBuffer();
        await playTTS(reply);
        await window.audio.resetBuffer();

        dispatch({ type: 'AI_END' });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'ERROR' });
      } finally {
        handlingRef.current = false;
      }
    },
    [
      aiProvider,
      aiModel,
      speakingLanguage,
      APIKey,
      stopMic,
      dispatch,
    ]
  );

  useEffect(() => {
    const unsubscribe = window.ai.onWhisperText(handleWhisperText);

    return () => {
      unsubscribe();
    };
  }, [handleWhisperText]);

  useEffect(() => {
    if (!mountedRef.current) return;

    if (store.state === 'listening') {
      startMic();
    } else {
      stopMic();
    }
  }, [store.state, startMic, stopMic]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopMic();
    };
  }, [stopMic]);

  return {
    start: () => dispatch({ type: 'START' }),
    stop: () => dispatch({ type: 'STOP' }),
    listening,
    messages: store.messages,};
}
