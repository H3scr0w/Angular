import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { MockAuthenticationService } from '../authentication/authentication.service.mock';
import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  describe('with credential', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
          { provide: AuthenticationService, useClass: MockAuthenticationService }
        ]
      });
    });

    beforeEach(inject([HttpClient, HttpTestingController], (_http: HttpClient, _httpMock: HttpTestingController) => {
      http = _http;
      httpMock = _httpMock;
    }));

    afterEach(() => {
      httpMock.verify();
    });

    it('should set headers with token', () => {
      // Given
      const headers: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer 123');

      // When
      http.get('http://localhost:123456', { observe: 'response' }).subscribe((response: HttpResponse<object>) => {
        expect(response.headers.get('Authorization')).toEqual('Bearer 123');
      });

      // Then
      httpMock.expectOne('http://localhost:123456').flush('body', { headers });
    });
  });

  describe('without credential', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    const authenticationService: MockAuthenticationService = new MockAuthenticationService();
    authenticationService.authenticated = false;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
          { provide: AuthenticationService, useValue: authenticationService }
        ]
      });
    });

    beforeEach(inject([HttpClient, HttpTestingController], (_http: HttpClient, _httpMock: HttpTestingController) => {
      http = _http;
      httpMock = _httpMock;
    }));

    afterEach(() => {
      httpMock.verify();
    });

    it('should set headers with token', () => {
      // Given
      // When
      http.get('http://localhost:123456', { observe: 'response' }).subscribe((response: HttpResponse<object>) => {
        expect(response.headers.get('Authorization')).toBeNull();
      });

      // Then
      httpMock.expectOne('http://localhost:123456').flush('body');
    });
  });
});
