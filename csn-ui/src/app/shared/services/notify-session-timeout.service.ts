import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NotifySessionTimeoutServiceService {
  private sessionTONotifiedSource = new Subject<any>();

  sessionTONotifiedSource$ = this.sessionTONotifiedSource.asObservable();

  notifySessionTimeOut() {
    this.sessionTONotifiedSource.next();
  }
}
