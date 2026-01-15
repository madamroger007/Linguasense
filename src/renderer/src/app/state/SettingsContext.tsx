import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AIProvider } from '../../../../shared/types/aiprovider';
import { AI_CATALOG } from '../../../../shared/model/aiCatalog';
interface SettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;

  dailyReminders: boolean;
  setDailyReminders: (enabled: boolean) => void;

  autoRun: boolean;
  setAutoRun: (enabled: boolean) => void;

  aiProvider: AIProvider;
  setAiProvider: (provider: AIProvider) => void;

  aiModel: string;
  setAiModel: (model: string) => void;

  speakingLanguage: string;
  setSpeakingLanguage: (language: string) => void;

  APIKey: string;
  setAPIKey: (key: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState(16);
  const [dailyReminders, setDailyRemindersState] = useState(true);
  const [autoRun, setAutoRunState] = useState(true);

  const [APIKey, setAPIKeyState] = useState('');

  const [aiProvider, setAiProviderState] =
    useState<AIProvider>('openai');
  const [aiModel, setAiModelState] =
    useState('gpt-4o-mini');

  const [speakingLanguage, setSpeakingLanguageState] =
    useState('english-us');

  // =========================
  // LOAD FROM localStorage
  // =========================
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedReminders = localStorage.getItem('dailyReminders');
    const savedAutoRun = localStorage.getItem('autoRun');
    const savedProvider = localStorage.getItem('aiProvider');
    const savedModel = localStorage.getItem('aiModel');
    const savedLanguage = localStorage.getItem('speakingLanguage');
    const savedAPIKey = localStorage.getItem('apiKey');

    if (savedFontSize) setFontSizeState(Number(savedFontSize));
    if (savedReminders) setDailyRemindersState(savedReminders === 'true');
    if (savedAutoRun) setAutoRunState(savedAutoRun === 'true');
    if (savedProvider) setAiProviderState(savedProvider as AIProvider);
    if (savedModel) setAiModelState(savedModel);
    if (savedLanguage) setSpeakingLanguageState(savedLanguage);
    if (savedAPIKey) setAPIKeyState(savedAPIKey);

    const appliedFontSize = savedFontSize ? Number(savedFontSize) : 16;
    document.documentElement.style.setProperty(
      '--app-font-size',
      `${appliedFontSize}px`
    );
  }, []);

  // =========================
  // SETTERS (WITH PERSIST)
  // =========================
  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size.toString());
    document.documentElement.style.setProperty(
      '--app-font-size',
      `${size}px`
    );
  };

  const setDailyReminders = (enabled: boolean) => {
    setDailyRemindersState(enabled);
    localStorage.setItem('dailyReminders', String(enabled));
  };

  const setAutoRun = (enabled: boolean) => {
    setAutoRunState(enabled);
    localStorage.setItem('autoRun', String(enabled));
  };

  const setAiProvider = (provider: AIProvider) => {
    setAiProviderState(provider);
    localStorage.setItem('aiProvider', provider);

    const firstModel = AI_CATALOG[provider]?.models[0]?.id;
    if (firstModel) {
      setAiModelState(firstModel);
      localStorage.setItem('aiModel', firstModel);
    }
  };

  const setAiModel = (model: string) => {
    setAiModelState(model);
    localStorage.setItem('aiModel', model);
  };

  const setSpeakingLanguage = (language: string) => {
    setSpeakingLanguageState(language);
    localStorage.setItem('speakingLanguage', language);
  };

  const setAPIKey = (key: string) => {
    setAPIKeyState(key);
    localStorage.setItem('apiKey', key);
  }
  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,

        dailyReminders,
        setDailyReminders,

        autoRun,
        setAutoRun,

        aiProvider,
        setAiProvider,

        aiModel,
        setAiModel,

        speakingLanguage,
        setSpeakingLanguage,

        APIKey,
        setAPIKey,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// =========================
// HOOK
// =========================
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
