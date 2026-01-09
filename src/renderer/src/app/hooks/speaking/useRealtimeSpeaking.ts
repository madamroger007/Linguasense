import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../../state/SettingsContext';
import { speakingGreeting } from '../../../../../shared/model/prompts/speaking';
import { getMicrophoneStream } from './useMicrophone';
import { startAudioChunking } from './useAudioChunk';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export function useRealtimeSpeaking() {
  const { aiProvider, aiModel, speakingLanguage } = useSettings();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: speakingGreeting(speakingLanguage),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const stopChunkingRef = useRef<null | (() => void)>(null);
  const isMountedRef = useRef(true);

  // =========================
  // Reset greeting on language change
  // =========================
  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: speakingGreeting(speakingLanguage),
      },
    ]);
  }, [speakingLanguage]);

  // =========================
  // Handle text from Whisper (MAIN)
  // =========================
  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (!spokenText || !isMountedRef.current) return;

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: spokenText },
      ]);

      setLoading(true);

      try {
        const reply = await window.ai.speak({
          provider: aiProvider,
          model: aiModel,
          language: speakingLanguage,
          message: spokenText,
        });

        if (!isMountedRef.current) return;

        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content:
              '⚠️ Sorry, something went wrong. Please try again.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [aiProvider, aiModel, speakingLanguage]
  );

  // =========================
  // START CALL
  // =========================
  const start = useCallback(async () => {
    if (listening) return;

    const stream = await getMicrophoneStream();

    // ✅ SEKARANG VALID
    window.ai.onWhisperText(handleWhisperText);

    stopChunkingRef.current = startAudioChunking(
      stream,
      (chunk) => {
        window.audio.sendChunk(chunk);
      }
    );

    window.audio.start();
    setListening(true);
  }, [handleWhisperText, listening]);

  // =========================
  // STOP CALL
  // =========================
  const stop = useCallback(() => {
    stopChunkingRef.current?.();
    stopChunkingRef.current = null;

    window.audio.stop();
    setListening(false);
  }, []);

  // =========================
  // CLEANUP
  // =========================
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    listening,
    messages,
    loading,
  };
}
