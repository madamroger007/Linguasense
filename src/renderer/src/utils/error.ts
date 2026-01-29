import { AppError, AppErrorType } from '@renderer/app/types/error';

export function mapError(err: unknown): AppError {
  // TIMEOUT
  if (
    err instanceof Error &&
    /timeout|timed out|ETIMEDOUT/i.test(err.message)
  ) {
    return {
      type: AppErrorType.TIMEOUT,
      message: 'The request took too long. Please try again.',
      retryable: true,
      autoDismiss: false,
      status: 'RETRY',
    };
  }

  // NETWORK
  if (
    err instanceof Error &&
    /network|fetch|ECONNREFUSED|ENOTFOUND/i.test(err.message)
  ) {
    return {
      type: AppErrorType.NETWORK,
      message: 'Network error occurred. Please try again.',
      retryable: true,
      autoDismiss: false,
      status: 'RETRY',
    };
  }

  // AI SERVICE
  if (
    err instanceof Error &&
    /ai|model|openai|llm/i.test(err.message)
  ) {
    return {
      type: AppErrorType.AI_SERVICE,
      message: 'Failed to connect to AI service.',
      retryable: true,
      autoDismiss: false,
      status: 'RETRY',
    };
  }

  // SYSTEM (fallback)
  return {
    type: AppErrorType.SYSTEM,
    message: 'An unexpected system error occurred.',
    retryable: false,
    autoDismiss: true,
    status: 'RELOAD',
  };
}


export function executeErrorStatus(error: AppError) {
  switch (error.status) {
    case 'RETRY':
      // soft retry = reload page
      window.location.reload();
      break;

    case 'RELOAD':
      // system error → reload app
      window.location.reload();
      break;

    case 'WAIT_ONLINE':
      window.addEventListener(
        'online',
        () => window.location.reload(),
        { once: true }
      );
      break;

    default:
      break;
  }
}
