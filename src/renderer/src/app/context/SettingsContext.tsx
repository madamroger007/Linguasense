
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';

import { SettingsState, SettingsAction } from '../types/settings';
import { settingsReducer } from '../reducer/settings';

const initialState: SettingsState = {
  fontSize: 16,
  dailyReminders: true,
  autoRun: true,
  aiProvider: 'openai',
  aiModel: 'gpt-4o-mini',
  speakingLanguage: 'english-us',
  apiKey: '',
  url: '',
};

type SettingsContextValue = {
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // =========================
  // LOAD FROM localStorage
  // =========================
  useEffect(() => {
    const payload: Record<string, string | number | boolean> = {};

    Object.keys(initialState).forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        payload[key] =
          value === 'true'
            ? true
            : value === 'false'
              ? false
              : isNaN(Number(value))
                ? value
                : Number(value);
      }
    });

    dispatch({ type: 'LOAD', payload: payload as Partial<SettingsState> });
  }, []);

  // =========================
  // PERSIST TO localStorage
  // =========================
  useEffect(() => {
    Object.entries(state).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
    });
  }, [state]);

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return ctx;
}
