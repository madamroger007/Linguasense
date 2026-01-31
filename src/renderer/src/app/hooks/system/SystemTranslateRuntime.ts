import { useEffect, useRef } from 'react';
import { useSystem } from '../../provider/SystemProvider';
import { useSettings } from '../../provider/SettingsProvider';
import { mapError } from '@renderer/utils/error';
import { setGlobalError } from '@renderer/app/store/error';

export function SystemTranslateRuntime() {
  const { state, dispatch } = useSystem();
  const { state: settings } = useSettings();
  const runningRef = useRef(false);

  useEffect(() => {
    if (!state.translateFeatureEnabled || runningRef.current) return;
    runningRef.current = true;

    (async () => {
      try {
        const selected = window.system.readClipboardText();
        if (!selected.trim()) return;

        const res = await window.ai.translate({
          provider: settings.aiProvider,
          request: {
            model: settings.aiModel,
            message: `Translate this text into ${settings.translateLanguage}:\n\n${selected}`,
            language: settings.translateLanguage,
            apiKey: settings.apiKey,
            url: settings.url,
          },
        });

        const text =
          typeof res === 'string'
            ? res
            : '';

        if (!text) return;

        window.system.writeClipboardText(text);


      } catch (err) {
        setGlobalError(mapError(err));
      } finally {
        runningRef.current = false;
        dispatch({ type: 'CLEAR_TRANSLATE' });
      }
    })();
  }, [state.translateFeatureEnabled]);

  return null;
}
