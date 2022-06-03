import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

/**
 * Prefixes all requests with `environment.serverUrl`.
 */
@Injectable({ providedIn: 'root' })
export class ApiPrefixInterceptor implements HttpInterceptor {
  /**
   * Intercept the request and modify it to add serverUrl
   *
   * @param request to intercept
   * @param next event
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq;
    if (request.url.startsWith('http')) {
      newReq = request.clone();
    } else {
      newReq = request.clone({ url: environment.serverUrl + request.url });
    }
    return next.handle(newReq);
  }
}
