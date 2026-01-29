export enum AppErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  AI_SERVICE = 'AI_SERVICE',
  SYSTEM = 'SYSTEM',
}

export type ErrorStatus =
  | 'RETRY'
  | 'RELOAD'
  | 'WAIT_ONLINE'
  | 'NONE';

export interface AppError {
  type: AppErrorType;
  message: string;
  retryable: boolean;
  autoDismiss: boolean;
  status: ErrorStatus; // 👈 KUNCI
}
