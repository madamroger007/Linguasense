import { useCallback, useEffect, useState } from 'react';
import { playTTS, stopTTS } from '../../../utils/text_speech';
import { useSettings } from '../../context/SettingsContext';
import { buildArticlePrompt } from '../../../../../shared/model/prompts/reading';
export function useReadingArticle() {
  const { state: settings } = useSettings();
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');
  const [speakingLanguage, setSpeakingLanguage] = useState('en_US');
  const [micEnabled, setMicEnabled] = useState(false);

  const [textToRead, setTextToRead] = useState('');
  const [loadingArticle, setLoadingArticle] = useState(false);

  useEffect(() => {
    if (!micEnabled || !textToRead) {
      window.ai.stopTTS();
      stopTTS();
      return;
    }
    playTTS(textToRead);
    return () => {
      window.ai.stopTTS();
      stopTTS();
    };
  }, [micEnabled, textToRead]);

  const generateNewArticle = useCallback(async () => {
    setLoadingArticle(true);

    try {
      const prompt = buildArticlePrompt(
        selectedLevel,
        speakingLanguage
      );

      const article = await window.ai.speak({
        provider: settings.aiProvider,
        request: {
          model: settings.aiModel,
          message: prompt,
          language: speakingLanguage,
          apiKey: settings.apiKey,
          url: settings.url,
        },
      });

      setTextToRead(article);
    } catch (error) {
      console.error('[reading] failed to generate article', error);
    } finally {
      setLoadingArticle(false);
    }
  }, [
    selectedLevel,
    speakingLanguage,
    settings.aiProvider,
    settings.aiModel,
    settings.apiKey,
    settings.url,
  ]);

  return {
    selectedLevel,
    speakingLanguage,
    micEnabled,
    textToRead,
    loadingArticle,

    setSelectedLevel,
    setSpeakingLanguage,
    setMicEnabled,

    generateNewArticle,
  };
}
