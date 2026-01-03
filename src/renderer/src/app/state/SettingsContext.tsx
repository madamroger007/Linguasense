import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
  dailyReminders: boolean;
  setDailyReminders: (enabled: boolean) => void;
  autoRun: boolean;
  setAutoRun: (enabled: boolean) => void;
  aiModel: string;
  setAiModel: (model: string) => void;
  speakingLanguage: string;
  setSpeakingLanguage: (language: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState(16);
  const [dailyReminders, setDailyRemindersState] = useState(true);
  const [autoRun, setAutoRunState] = useState(true);
  const [aiModel, setAiModelState] = useState('chatgpt');
  const [speakingLanguage, setSpeakingLanguageState] = useState('english-us');

  // Load all settings from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedReminders = localStorage.getItem('dailyReminders');
    const savedAutoRun = localStorage.getItem('autoRun');
    const savedAiModel = localStorage.getItem('aiModel');
    const savedLanguage = localStorage.getItem('speakingLanguage');

    if (savedFontSize) setFontSizeState(parseInt(savedFontSize));
    if (savedReminders) setDailyRemindersState(savedReminders === 'true');
    if (savedAutoRun) setAutoRunState(savedAutoRun === 'true');
    if (savedAiModel) setAiModelState(savedAiModel);
    if (savedLanguage) setSpeakingLanguageState(savedLanguage);

    // Apply font size globally
    const fontSize = savedFontSize ? parseInt(savedFontSize) : 16;
    document.documentElement.style.setProperty('--app-font-size', `${fontSize}px`);
  }, []);

  // Wrapper functions that save to localStorage
  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size.toString());
    document.documentElement.style.setProperty('--app-font-size', `${size}px`);
  };

  const setDailyReminders = (enabled: boolean) => {
    setDailyRemindersState(enabled);
    localStorage.setItem('dailyReminders', enabled.toString());
  };

  const setAutoRun = (enabled: boolean) => {
    setAutoRunState(enabled);
    localStorage.setItem('autoRun', enabled.toString());
  };

  const setAiModel = (model: string) => {
    setAiModelState(model);
    localStorage.setItem('aiModel', model);
  };

  const setSpeakingLanguage = (language: string) => {
    setSpeakingLanguageState(language);
    localStorage.setItem('speakingLanguage', language);
  };

  return (
    <SettingsContext.Provider
      value={{
        fontSize,
        setFontSize,
        dailyReminders,
        setDailyReminders,
        autoRun,
        setAutoRun,
        aiModel,
        setAiModel,
        speakingLanguage,
        setSpeakingLanguage,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
