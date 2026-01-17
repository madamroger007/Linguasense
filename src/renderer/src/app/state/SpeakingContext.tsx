import { createContext, useContext, useReducer } from 'react';
import { speakingPrompt } from '../../../../shared/model/prompts/speaking';

export type Message = {
  role: 'user' | 'ai';
  content: string;
};

export type SpeakingState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'ai_speaking';


type SpeakingAction =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'PROCESSING' }
  | { type: 'AI_START' }
  | { type: 'AI_END' }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'RESET_MESSAGES'; language: string }
  | { type: 'ERROR' };

type SpeakingStore = {
  state: SpeakingState;
  messages: Message[];
  loading?: boolean;
};

function speakingReducer(
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

    case 'ADD_MESSAGE':
      return {
        ...store,
        messages: [...store.messages, action.message],
      };
    case 'SET_LOADING':
      return { ...store, loading: action.value };

    case 'RESET_MESSAGES':
      return {
        ...store,
        messages: [
          {
            role: 'ai',
            content: speakingPrompt(action.language),
          },
        ],
      };

    default:
      return store;
  }
}

const SpeakingContext = createContext<{
  store: SpeakingStore;
  dispatch: React.Dispatch<SpeakingAction>;
} | null>(null);

export function SpeakingProvider({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(speakingReducer, {
    state: 'idle',
    messages: [
      {
        role: 'ai',
        content: speakingPrompt('english-us'),
      },
    ],
  });

  return (
    <SpeakingContext.Provider value={{ store, dispatch }}>
      {children}
    </SpeakingContext.Provider>
  );
}

export function useSpeaking() {
  const ctx = useContext(SpeakingContext);
  if (!ctx) {
    throw new Error('useSpeaking must be used inside SpeakingProvider');
  }
  return ctx;
}
