import React, { createContext, useContext, useReducer } from 'react';
import { Action, SystemReducer, SystemState } from '../reducer/system';

const initialState: SystemState = {
  speechFeatureEnabled: true,
  speechActive: false,

};

const SystemContext = createContext<{
  state: SystemState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(SystemReducer, initialState);
  return (
    <SystemContext.Provider value={{ state, dispatch }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used in provider');
  return ctx;
}
