import { useReducer } from 'react';
import { errorReducer } from '../error';
let globalDispatch: React.Dispatch<any> | null = null;

export function useErrorStore() {
  const [error, dispatch] = useReducer(errorReducer, null);

  globalDispatch = dispatch;

  return { error, dispatch };
}

export function setGlobalError(payload: any) {
  globalDispatch?.({ type: 'SET_ERROR', payload });
}

export function clearGlobalError() {
  globalDispatch?.({ type: 'CLEAR_ERROR' });
}
