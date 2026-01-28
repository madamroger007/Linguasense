import { SettingsAction, SettingsState } from '../types/settings';
import { AI_CATALOG } from '../../../../shared/utils/aiCatalog';


export function settingsReducer(
  state: SettingsState,
  action: SettingsAction
): SettingsState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload };

    case 'SET_FONT_SIZE':
      document.documentElement.style.setProperty(
        '--app-font-size',
        `${action.payload}px`
      );
      return { ...state, fontSize: action.payload };

    case 'SET_AI_PROVIDER': {
      const firstModel = AI_CATALOG[action.payload]?.models[0]?.id;
      return {
        ...state,
        aiProvider: action.payload,
        aiModel: firstModel ?? state.aiModel,
      };
    }

    case 'SET_DAILY_REMINDERS':
      return { ...state, dailyReminders: action.payload };

    case 'SET_AUTO_RUN':
      return { ...state, autoRun: action.payload };

    case 'SET_AI_MODEL':
      return { ...state, aiModel: action.payload };

    case 'SET_SPEAKING_LANGUAGE':
      return { ...state, speakingLanguage: action.payload };

    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };

    case 'SET_URL':
      return { ...state, url: action.payload };

    default:
      return state;
  }
}
