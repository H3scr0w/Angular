import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { Credentials } from '../authentication/model/credentials';

/**
 * Token Interceptor to add 'Authorization'
 */
@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  /**
   * Instantiate the interceptor
   */
  constructor(private authentificationService: AuthenticationService) {}

  /**
   * Intercept the request and modify it to add serverUrl and authorization
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const credentials: Credentials = this.authentificationService.credentials;
    let newReq;
    if (credentials && req.url.startsWith(environment.serverUrl)) {
      newReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${credentials.jwt}`
        }
      });
    } else {
      newReq = req.clone();
    }
    return next.handle(newReq);
  }
}
