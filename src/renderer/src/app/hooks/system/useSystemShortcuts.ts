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

    const offTranslate = window.system.onTranslate(async () => {
      if (!state.translateFeatureEnabled) return;

      const text = window.system?.readClipboardText();
      if (!text || !text.trim()) return;

      dispatch({
        type: 'REQUEST_TRANSLATE',
        text,
      });
    });

    return () => {
      offSpeech?.();
      offTranslate?.();
    };
  }, [
    dispatch,
    state.speechFeatureEnabled,
    state.translateFeatureEnabled,
  ]);
}

