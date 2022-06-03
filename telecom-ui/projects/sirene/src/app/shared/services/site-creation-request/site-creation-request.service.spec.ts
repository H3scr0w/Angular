import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { SiteRequest } from '../../models/site-request';
import { SiteCreationRequestService } from './site-creation-request.service';

describe('SiteCreationRequestService', () => {
  let service: SiteCreationRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiteCreationRequestService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SiteCreationRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([SiteCreationRequestService], (requestService: SiteCreationRequestService) => {
    expect(requestService).toBeTruthy();
  }));

  it('should return an Observable of a Site Request paginated', async(() => {
    // fake response
    const expectedResponse: Page<SiteRequest> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<SiteRequest>;
    service.getAllSiteCreationRequest(0, 10).subscribe((result: Page<SiteRequest>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/site-creation-requests?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
