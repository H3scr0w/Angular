import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { SiteRequest } from '../../models/site-request';
import { SiteModificationRequestService } from './site-modification-request.service';

describe('SiteModificationRequestService', () => {
  let service: SiteModificationRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiteModificationRequestService]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(SiteModificationRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([SiteModificationRequestService], (requestService: SiteModificationRequestService) => {
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
    service.getAllSiteModificationRequest(0, 10).subscribe((result: Page<SiteRequest>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/site-modification-requests?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
