import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from '../../models/page.model';
import { Request } from '../../models/request';
import { RequestCancellationDTO } from '../../models/request-cancellation';
import { RequestService } from './request.service';

describe('RequestService', () => {
  let requestService: RequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestService]
    });
  });

  beforeEach(() => {
    requestService = TestBed.inject(RequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: RequestService = TestBed.inject(RequestService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Cancellation Request paginated', async(() => {
    // fake response
    const expectedResponse: Page<RequestCancellationDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<RequestCancellationDTO>;
    requestService
      .getAllRequestCancellations(0, 10, null, '')
      .subscribe((result: Page<RequestCancellationDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/requests/cancelled?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Requests paginated', async(() => {
    // fake response
    const expectedResponse: Page<Request> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Request>;
    requestService.getAllRequests('', 0, 10, null, '').subscribe((result: Page<Request>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/requests?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
