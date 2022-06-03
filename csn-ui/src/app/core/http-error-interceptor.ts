import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {SessionTimeOutModalComponent} from '../shared/session-time-out-modal/session-time-out-modal.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NotifySessionTimeoutServiceService} from '../shared/services/notify-session-timeout.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  bsModalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered',
  };
  constructor(private modalService: BsModalService,
              private notifySessionTimeOutService: NotifySessionTimeoutServiceService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        if (err.status === 401) {
          this.notifySessionTimeOutService.notifySessionTimeOut();
          this.bsModalRef = this.modalService.show(SessionTimeOutModalComponent, this.config);
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
    }));
  }
}
