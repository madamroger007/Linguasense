export type SystemState = {
  speechFeatureEnabled: boolean;
  translateFeatureEnabled: boolean;
  speechActive: boolean;
  translateRequested: boolean;
  selectedText: string | null;
};

export type Action =
  | { type: 'TOGGLE_SPEECH_ACTIVE' }
  | { type: 'REQUEST_TRANSLATE'; text: string }
  | { type: 'CLEAR_TRANSLATE' }
  | { type: 'SET_SPEECH_FEATURE'; value: boolean }
  | { type: 'SET_TRANSLATE_FEATURE'; value: boolean };

export function SystemReducer(state: SystemState, action: Action): SystemState {
  switch (action.type) {
    case 'SET_SPEECH_FEATURE':
      return {
        ...state,
        speechFeatureEnabled: action.value,
        speechActive: action.value ? state.speechActive : false,
      };

    case 'SET_TRANSLATE_FEATURE':
      return {
        ...state,
        translateFeatureEnabled: action.value,
        translateRequested: false,
      };

    case 'TOGGLE_SPEECH_ACTIVE':
      if (!state.speechFeatureEnabled) return state;
      return { ...state, speechActive: !state.speechActive };

    case 'REQUEST_TRANSLATE':
      if (!state.translateFeatureEnabled) return state;
      return {
        ...state,
        translateRequested: true,
        selectedText: action.text,
      };

    case 'CLEAR_TRANSLATE':
      return {
        ...state,
        translateRequested: false,
        selectedText: null,
      };
    default:
      return state;
  }
}
