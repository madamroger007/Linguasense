export type SystemState = {
  speechFeatureEnabled: boolean;
  speechActive: boolean;

};

export type Action =
  | { type: 'TOGGLE_SPEECH_ACTIVE' }
  | { type: 'SET_SPEECH_FEATURE'; value: boolean }

export function SystemReducer(state: SystemState, action: Action): SystemState {
  switch (action.type) {
    case 'SET_SPEECH_FEATURE':
      return {
        ...state,
        speechFeatureEnabled: action.value,
        speechActive: action.value ? state.speechActive : false,
      };
    case 'TOGGLE_SPEECH_ACTIVE':
      if (!state.speechFeatureEnabled) return state;
      return { ...state, speechActive: !state.speechActive };

    default:
      return state;
  }
}
