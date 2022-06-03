import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { AuthenticationService } from './../authentication/authentication.service';

import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';
class MatSnackBarMock extends MatSnackBar {
  constructor() {
    super(null!, null!, null!, null!, null!, null!);
  }
  open(message: string, action?: string, config?: MatSnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
    return null!;
  }
}

class AuthenticationServiceMock extends AuthenticationService {
  constructor() {
    super(null!);
  }
}

describe('ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const createInterceptor = () => {
    errorHandlerInterceptor = new ErrorHandlerInterceptor(new MatSnackBarMock(), new AuthenticationServiceMock());
    return errorHandlerInterceptor;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useFactory: createInterceptor,
          multi: true
        }
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

  it('should catch error and call error handler', () => {
    // Act
    http.get('/toto').subscribe(
      () => {},
      (error) => {
        // Assert
        expect(error).toBeDefined();
      }
    );

    httpMock.expectOne({}).flush(null, {
      status: 404,
      statusText: 'error'
    });
  });
});
