import {HttpErrorInterceptor} from './http-error-interceptor';
import {TestBed} from '@angular/core/testing';
import {AuthService} from './services/auth.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpHandler} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ApiNotarialeService} from './services/api-notariale.service';
import {NotifySessionTimeoutServiceService} from '../shared/services/notify-session-timeout.service';
import {AlertModule, BsModalService, ModalModule} from 'ngx-bootstrap';

describe('HttpErrorInterceptor', () => {
  let httpInterceptor: HttpErrorInterceptor;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        AlertModule.forRoot(),
      ],
      providers: [
        HttpErrorInterceptor,
        HttpClient,
        HttpHandler,
        CookieService,
        ApiNotarialeService,
        NotifySessionTimeoutServiceService,
        BsModalService,
        {provide: AuthService, useClass: AuthService},
        {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    httpInterceptor = TestBed.inject(HttpErrorInterceptor);
    authService = TestBed.inject(AuthService);
  });
    it('should create an instance', () => {
    httpInterceptor = TestBed.inject(HttpErrorInterceptor);
    expect(httpInterceptor).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
