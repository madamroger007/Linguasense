import { useCallback, useState } from 'react';
import { useSettings } from '../../provider/SettingsProvider';
import { buildWritingDescriptionPrompt, buildWritingFeedbackPrompt } from '../../../../../shared/model/prompts/writing';
import { setGlobalError } from '@renderer/app/store/error';
import { mapError } from '@renderer/utils/error';

export interface WritingFeedback {
  suggestions: string[];
  score: number;
  summary: string;
}

export function useWriting() {
  const { state: settings } = useSettings();

  const [fromLanguage, setFromLanguage] = useState('id_ID');
  const [toLanguage, setToLanguage] = useState('en_US');

  const [descriptionText, setDescriptionText] = useState('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [userWriting, setUserWriting] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const generateDescription = useCallback(async () => {
    setLoadingDescription(true);
    setFeedback(null);

    try {
      const prompt = buildWritingDescriptionPrompt(
        fromLanguage,
        toLanguage
      );

      const result = await window.ai.speak({
        provider: settings.aiProvider,
        request: {
          model: settings.aiModel,
          message: prompt,
          language: fromLanguage,
          apiKey: settings.apiKey,
          url: settings.url,
        },
      });

      setDescriptionText(result);
      setUserWriting('');
    } catch (err) {
      const appError = mapError(err);
      setGlobalError(appError);
    } finally {
      setLoadingDescription(false);
    }
  }, [
    fromLanguage,
    toLanguage,
    settings.aiProvider,
    settings.aiModel,
    settings.apiKey,
    settings.url,
  ]);

  // Analyze user writing
  const analyzeWriting = useCallback(async () => {
    if (!userWriting.trim()) return;

    setLoadingFeedback(true);

    try {
      const prompt = buildWritingFeedbackPrompt(
        descriptionText,
        userWriting,
        fromLanguage,
        toLanguage
      );

      const result = await window.ai.speak({
        provider: settings.aiProvider,
        request: {
          model: settings.aiModel,
          message: prompt,
          language: toLanguage,
          apiKey: settings.apiKey,
          url: settings.url,
        },
      });

      const parsed: WritingFeedback = JSON.parse(result);
      setFeedback(parsed);
    } catch (err) {
      const appError = mapError(err);
      setGlobalError(appError);
    } finally {
      setLoadingFeedback(false);
    }
  }, [
    userWriting,
    descriptionText,
    fromLanguage,
    toLanguage,
    settings.aiProvider,
    settings.aiModel,
    settings.apiKey,
    settings.url,
  ]);

  // Reset writing only
  const clearWriting = () => {
    setUserWriting('');
    setFeedback(null);
  };

  return {
    // language
    fromLanguage,
    toLanguage,
    setFromLanguage,
    setToLanguage,

    // description
    descriptionText,
    loadingDescription,
    generateDescription,

    // writing
    userWriting,
    setUserWriting,
    clearWriting,

    // feedback
    feedback,
    loadingFeedback,
    analyzeWriting,
  };
}
