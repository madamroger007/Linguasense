
export type Message = {
  role: 'user' | 'ai';
  content: string;
};

export type SpeakingState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'ai_speaking';

export type SpeakingAction =
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'PROCESSING' }
  | { type: 'AI_START' }
  | { type: 'AI_END' }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'MESSAGES'; message: Message }
  | { type: 'ERROR' }
  | { type: 'SET_LANGUAGE'; value: string };

export type SpeakingStore = {
  state: SpeakingState;
  messages: Message[];
  loading?: boolean;
  language: string;
};
