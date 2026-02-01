import { AppError } from "@renderer/app/types/error";

export type ErrorState = AppError | null;

export type ErrorAction =
  | { type: 'SET_ERROR'; payload: AppError }
  | { type: 'CLEAR_ERROR' };

export function errorReducer(
  state: ErrorState,
  action: ErrorAction
): ErrorState {
  switch (action.type) {
    case 'SET_ERROR':
      return action.payload;
    case 'CLEAR_ERROR':
      return null;
    default:
      return state;
  }
}
