import { SpeakingAction, SpeakingStore } from "../types/speaking";

export function speakingReducer(
  store: SpeakingStore,
  action: SpeakingAction
): SpeakingStore {
  switch (action.type) {
    case 'START':
      return store.state === 'idle'
        ? { ...store, state: 'listening' }
        : store;

    case 'PROCESSING':
      return { ...store, state: 'processing' };

    case 'AI_START':
      return { ...store, state: 'ai_speaking' };

    case 'AI_END':
      return { ...store, state: 'listening' };

    case 'STOP':
    case 'ERROR':
      return { ...store, state: 'idle' };

    case 'MESSAGES':
      return {
        ...store,
        messages: [...store.messages, action.message],
      };
    case 'SET_LOADING':
      return { ...store, loading: action.value };
    default:
      return store;
  }
}
