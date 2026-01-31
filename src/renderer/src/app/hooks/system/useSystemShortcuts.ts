import { useEffect } from 'react';
import { useSystem } from '../../provider/SystemProvider';

export function useSystemShortcuts() {
  const { state, dispatch } = useSystem();

  useEffect(() => {
    if (!window.system) return;

    const offSpeech = window.system.onToggleSpeech(() => {
      if (!state.speechFeatureEnabled) return;
      dispatch({ type: 'TOGGLE_SPEECH_ACTIVE' });
    });

    return () => {
      offSpeech?.();
    };
  }, [
    dispatch,
    state.speechFeatureEnabled,
  ]);
}

