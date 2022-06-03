import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Logger } from '@delivery/stgo-common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../../shared/service/message/message.service';

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
   *
   * @param snackBar to handle alert
   */
  constructor(private messageService: MessageService) {}

  /**
   * Intercept the request and throw error if there is
   *
   * @param request to intercept
   * @param next event
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has('X-Skip-Error-Interceptor')) {
      const headers = request.headers.delete('X-Skip-Error-Interceptor');
      return next.handle(request.clone({ headers }));
    }
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  /**
   * Show error into log or anything
   *
   * @param response to parse the error
   */
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    log.error('Request error', response);
    if (response instanceof HttpErrorResponse) {
      const e: HttpErrorResponse = response as HttpErrorResponse;
      if (e.error && e.error.detail) {
        this.messageService.show(e.error.detail, 'error');
      } else if (e.error && e.error.message) {
        this.messageService.show(e.error.message, 'error');
      } else {
        this.messageService.show(e.status + ' : ' + e.statusText, 'error');
      }
    }
    throw response;
  }
}
