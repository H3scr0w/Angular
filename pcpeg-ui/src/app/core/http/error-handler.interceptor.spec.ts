import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';

describe('ErrorHandlerInterceptor', () => {
  let errorHandlerInterceptor: ErrorHandlerInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const createInterceptor = () => {
    errorHandlerInterceptor = new ErrorHandlerInterceptor(null!);
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
        },
        { provide: MessageService, useClass: MockMessageService }
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
