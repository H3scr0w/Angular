import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './../authentication/authentication.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Logger } from '../logger/logger.service';

/**
 * The logger
 */
const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerInterceptor implements HttpInterceptor {
  /**
   * Instantiate the interceptor
   */
  constructor(private snackBar: MatSnackBar, private authenticationService: AuthenticationService) {}

  /**
   * Intercept the request and throw error if there is
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('X-Skip-Error-Interceptor')) {
      const headers = request.headers.delete('X-Skip-Error-Interceptor');
      return next.handle(request.clone({ headers }));
    }
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));
  }

  /**
   * Show error into log or anything
   */
  private errorHandler(response: HttpEvent<unknown>): Observable<HttpEvent<unknown>> {
    if (!this.authenticationService.isAuthenticated()) {
      log.debug('Not authenticated, redirecting...');
      this.authenticationService.logout();
      throw response;
    }

    log.error('Request error', response);
    if (response instanceof HttpErrorResponse) {
      const e: HttpErrorResponse = response as HttpErrorResponse;
      if (e.error && e.error.message) {
        this.snackBar.open(e.error.message, '', {
          duration: 4000,
          panelClass: 'error',
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
      } else if (e.error && e.error.detail) {
        this.snackBar.open(e.error.status + ' ' + e.error.detail, '', {
          duration: 4000,
          panelClass: 'error',
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
      } else {
        this.snackBar.open(e.statusText + '<br/>' + e.message, '', {
          duration: 4000,
          panelClass: 'error',
          verticalPosition: 'bottom',
          horizontalPosition: 'end'
        });
      }
    }
    throw response;
  }
}
