import { TokenModel } from '@app/shared';

export interface PasswordState {
  formSubmit: boolean;
  tokenExpired: boolean;
  token: TokenModel;
}
