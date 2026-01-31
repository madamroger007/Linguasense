import { createContext, useContext, useReducer } from 'react';
import { SpeakingStore, SpeakingAction } from '../types/speaking';
import { speakingReducer } from '../reducer/speaking';

const SpeakingContext = createContext<{
  store: SpeakingStore;
  dispatch: React.Dispatch<SpeakingAction>;
} | null>(null);

const initialStore: SpeakingStore = {
  state: 'idle',
  messages: [],
  loading: false,
  language: 'English (United States)',
};
export function SpeakingProvider({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(speakingReducer, initialStore);

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
