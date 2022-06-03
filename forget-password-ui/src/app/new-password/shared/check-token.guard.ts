import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppState } from '@app/core/app.state';
import { PasswordGetTokenAction, PasswordGetTokenExpiredAction } from '@app/core/password/password.action';
import { TokenModel, TokenService } from '@app/shared';
import { environment } from '@env/environment';
import { Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private tokenService: TokenService,
    private store: Store<AppState>
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const tokenId: string = next.params['token'];
    return this.tokenService.getLink(tokenId).pipe(
      map((token: TokenModel) => {
        if (token) {
          this.store.dispatch(new PasswordGetTokenAction(token));
          return true;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 410) {
          this.store.dispatch(new PasswordGetTokenExpiredAction());
          this.router.navigate(['/expired']);
        } else {
          this.document.location.href = environment.oauthBaseUrl;
        }
        return of(false);
      })
    );
  }
}
