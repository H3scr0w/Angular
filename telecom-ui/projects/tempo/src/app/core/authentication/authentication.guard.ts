import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Logger } from '@delivery/stgo-common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Jwt } from './model/jwt';
import { TokenInfo } from './model/token-info';

/**
 * The logger
 */
const log = new Logger('AuthenticationGuard');

/**
 * The authentication guard
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationGuard implements CanActivate {
  /**
   * Instantiate the guard
   */
  constructor(
    @Inject(DOCUMENT) private document: any,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  /**
   * Check if the user can access
   */
  canActivate(): Observable<boolean> {
    return this.authenticationService.processLogin().pipe(
      map((result: [TokenInfo, Jwt]) => {
        const tokenInfo = result[0];
        const jwt = result[1];
        if (this.authenticationService.isAuthenticated()) {
          if (this.authenticationService.isBelongGroup()) {
            return true;
          } else {
            this.router.navigate(['not-authorize']);
            return false;
          }
        }
        if (tokenInfo.access_token) {
          this.authenticationService.createCredentials(tokenInfo, jwt);
          if (this.authenticationService.isBelongGroup()) {
            return true;
          } else {
            this.router.navigate(['not-authorize']);
            return false;
          }
        } else {
          log.debug('Not authenticated, redirecting...');
          this.redirect(this.authenticationService.getAuthorizationRequestUrl());
          return false;
        }
      })
    );
  }

  /**
   * Sends the browser to a new URL
   */
  private redirect(url: string): void {
    this.document.location.href = url;
  }
}
