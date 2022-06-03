import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment } from '@angular/router';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';
import { Jwt } from './model/jwt';

/**
 * The logger
 */
const log = new Logger('AuthenticationGuard');

/**
 * The authentication guard
 */
@Injectable()
export class AuthenticationGuard implements CanActivate, CanLoad {
  /**
   * Instantiate the guard
   */
  constructor(@Inject(DOCUMENT) private document: Document, private authenticationService: AuthenticationService) {}

  /**
   * Check if the user can access
   */
  canActivate(): Observable<boolean> {
    if (this.authenticationService.isAuthenticated()) {
      return of(true);
    } else {
      return this.authenticationService.processLogin().pipe(
        map((jwt: Jwt) => {
          if (jwt) {
            this.authenticationService.createCredentials(jwt);
            return true;
          } else {
            log.debug('Not authenticated, redirecting...');
            this.redirect(this.authenticationService.getLoginUrl());
            return false;
          }
        })
      );
    }
  }

  /**
   * Check if the user is Admin
   */
  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.authenticationService.credentials.hasAdminAccess;
  }

  /**
   * Sends the browser to a new URL
   */
  private redirect(url: string): void {
    this.document.location.href = url;
  }
}
