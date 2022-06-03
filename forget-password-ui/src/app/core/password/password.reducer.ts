import { PasswordAction, PasswordActionTypes } from './password.action';
import { PasswordState } from './password.state';

const initialState: PasswordState = {
  formSubmit: false,
  tokenExpired: false,
  token: null
};

export function passwordReducer(state: PasswordState = initialState, action: PasswordAction): PasswordState {
  switch (action.type) {
    case PasswordActionTypes.SUBMIT:
      return {
        ...state,
        formSubmit: true
      };
    case PasswordActionTypes.GET_TOKEN:
      return {
        ...state,
        token: action.token
      };
    case PasswordActionTypes.GET_TOKEN_EXPIRED:
      return {
        ...state,
        tokenExpired: true
      };
    default:
      return state;
  }
}
