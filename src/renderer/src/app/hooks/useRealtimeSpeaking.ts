import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { speakWithAI } from '../../model/ai';
import { useSettings } from '../state/SettingsContext';
import { speakingGreeting } from '../../model/ai/prompts/speaking';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export function useRealtimeSpeaking() {
  const { aiProvider, aiModel, speakingLanguage } = useSettings();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: speakingGreeting(speakingLanguage), // ✅ DARI FILE PROMPT
    },
  ]);

  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  // Reset greeting when language changes
  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: speakingGreeting(speakingLanguage),
      },
    ]);
  }, [speakingLanguage]);

  const handleSpeech = useCallback(
    async (spokenText: string) => {
      if (!spokenText || !isMountedRef.current) return;

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: spokenText },
      ]);

      setLoading(true);

      try {
        const reply = await speakWithAI(aiProvider, {
          message: spokenText,
          language: speakingLanguage,
          model: aiModel,
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

  const { start, stop, listening } = useSpeechRecognition(
    handleSpeech,
    { autoRestart: true }
  );

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
