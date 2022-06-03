import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'ngx-session-time-out-modal',
  templateUrl: './session-time-out-modal.component.html',
  styleUrls: ['./session-time-out-modal.component.scss'],
})
export class SessionTimeOutModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef,
              private cookieService: CookieService) { }

  ngOnInit() {
    this.cookieService.deleteAll();
  }

  reconnect() {
    this.bsModalRef.hide();
    window.location.reload();
  }
}
