import { AIProvider } from '../../../../shared/types/aiprovider';

export interface SettingsState {
  fontSize: number;
  dailyReminders: boolean;
  autoRun: boolean;
  aiProvider: AIProvider;
  aiModel: string;
  apiKey: string;
  url: string;
  translateLanguage: string;
}


export type SettingsAction =
  | { type: 'LOAD'; payload: Partial<SettingsState> }
  | { type: 'SET_FONT_SIZE'; payload: number }
  | { type: 'SET_DAILY_REMINDERS'; payload: boolean }
  | { type: 'SET_AUTO_RUN'; payload: boolean }
  | { type: 'SET_AI_PROVIDER'; payload: AIProvider }
  | { type: 'SET_AI_MODEL'; payload: string }
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'SET_URL'; payload: string }
  | { type: 'SET_TRANSLATE_LANGUAGE'; payload: string };
