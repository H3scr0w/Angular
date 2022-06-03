import { TokenModel } from '@app/shared';
import { Action } from '@ngrx/store';

export enum PasswordActionTypes {
  SUBMIT = '[Password] Submit form',
  SUBMIT_SUCCESS = '[Password] Submit form success',
  GET_TOKEN = '[Password] Get token',
  GET_TOKEN_EXPIRED = '[Password] Get token expired'
}

export class PasswordSubmitAction implements Action {
  readonly type = PasswordActionTypes.SUBMIT;

  constructor(public sgid: string, public email: string, public captcha: string) {}
}

export class PasswordSubmitSuccessAction implements Action {
  readonly type = PasswordActionTypes.SUBMIT_SUCCESS;

  constructor() {}
}

export class PasswordGetTokenAction implements Action {
  readonly type = PasswordActionTypes.GET_TOKEN;

  constructor(public token: TokenModel) {}
}

export class PasswordGetTokenExpiredAction implements Action {
  readonly type = PasswordActionTypes.GET_TOKEN_EXPIRED;

  constructor() {}
}

export type PasswordAction =
  | PasswordSubmitAction
  | PasswordSubmitSuccessAction
  | PasswordGetTokenAction
  | PasswordGetTokenExpiredAction;
