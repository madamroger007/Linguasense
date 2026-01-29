import { useEffect } from 'react';
import { clearGlobalError, useErrorStore } from '../../reducer/store/error';
import { executeErrorStatus } from '../../../utils/error';

export function GlobalErrorBanner() {
  const { error } = useErrorStore();

  useEffect(() => {
    if (!error || error.autoDismiss === false) return;

    const timer = setTimeout(clearGlobalError, 5000);
    return () => clearTimeout(timer);
  }, [error]);

  if (!error) return null;

  return (
    <div
      role="alert"
      className="
        fixed top-4 left-1/2 z-[9999]
        -translate-x-1/2
        w-[90%] max-w-xl
        rounded-lg border border-red-500/40
        bg-red-950/90 text-red-100
        shadow-lg backdrop-blur
      "
    >
      <div className="p-4">
        <div className="font-semibold text-red-400">Error</div>

        <p className="mt-1 text-sm">
          {error.message}
        </p>

        <div className="mt-4 flex justify-end gap-2">
          {error.retryable && (
            <button
              className="
                rounded-md border border-red-400/40
                px-3 py-1 text-sm
                hover:bg-red-500/10
              "
              onClick={() => {
                clearGlobalError();
                executeErrorStatus(error);
              }}
            >
              Retry
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
