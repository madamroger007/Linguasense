import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../../state/SettingsContext';
import { speakingPrompt } from '../../../../../shared/model/prompts/speaking';
import { getMicrophoneStream } from './useMicrophone';
import { startAudioChunking } from './useAudioChunk';
import { playTTS } from '../../../utils/text_speech';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export function useRealtimeSpeaking() {
  const { aiProvider, aiModel, speakingLanguage, APIKey } = useSettings();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: speakingPrompt(speakingLanguage),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const stopChunkingRef = useRef<null | (() => void)>(null);
  const isMountedRef = useRef(true);
  const isAISpeakingRef = useRef(false);

  // =========================
  // Reset greeting on language change
  // =========================
  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: speakingPrompt(speakingLanguage),
      },
    ]);
  }, [speakingLanguage]);

  // =========================
  // Handle text from Whisper (MAIN)
  // =========================
  const handleWhisperText = useCallback(
    async (spokenText: string) => {
      if (!spokenText || isAISpeakingRef.current || !isMountedRef.current) {
        console.log('[VOICE] Ignored input, AI is speaking');
        return;
      }
      // tampilkan user text
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: spokenText },
      ]);

      setLoading(true);

      try {
        // =========================
        // 1. AI RESPONSE (TEXT)
        // =========================
        const reply = await window.ai.speak({
          provider: aiProvider,
          model: aiModel,
          language: speakingLanguage,
          message: spokenText,
          apiKey: APIKey,
        });

        if (!isMountedRef.current) return;

        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: reply },
        ]);

        // =========================
        // 2. TEXT → SPEECH (PIPER)
        // =========================
        // stop mic supaya tidak feedback
        isAISpeakingRef.current = true;
        window.audio.stop();
        await window.audio.resetBuffer();
        // =========================
        // 3. TEXT → SPEECH (WAIT!)
        // =========================
        await playTTS(reply);

        // =========================
        // 4. UNLOCK + RESUME MIC
        // =========================
        isAISpeakingRef.current = false;
        await window.audio.resetBuffer();
        if (isMountedRef.current) {
          window.audio.start();
        }

      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            content: '⚠️ Sorry, something went wrong.',
          },
        ]);

        // lanjutkan mic setelah AI selesai bicara
        isAISpeakingRef.current = false;
        window.audio.start();
      } finally {

        setLoading(false);
      }
    },
    [aiProvider, aiModel, speakingLanguage, APIKey]
  );

  // =========================
  // START CALL
  // =========================
  const start = useCallback(async () => {
    if (listening) return;

    const stream = await getMicrophoneStream();

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
