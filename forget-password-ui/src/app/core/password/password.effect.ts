import { Injectable } from '@angular/core';
import {
  PasswordActionTypes,
  PasswordSubmitAction,
  PasswordSubmitSuccessAction
} from '@app/core/password/password.action';
import { TokenService } from '@app/shared';
import { ofType, Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PasswordEffect {
  constructor(private actions: Actions<Action>, private tokenService: TokenService) {}

  @Effect()
  submitForm(): Observable<Action> {
    return this.actions.pipe(
      ofType(PasswordActionTypes.SUBMIT),
      map((action: PasswordSubmitAction) => action),
      switchMap((action: PasswordSubmitAction) =>
        this.tokenService.createLink(action.sgid, action.email, action.captcha).pipe(
          map(() => new PasswordSubmitSuccessAction()),
          catchError(() => of(new PasswordSubmitSuccessAction()))
        )
      )
    );
  }
}
