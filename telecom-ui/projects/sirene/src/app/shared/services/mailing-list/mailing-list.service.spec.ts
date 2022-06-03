import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { MailingList, Page } from '@shared';
import { MailingListService } from './mailing-list.service';

describe('SiteService', () => {
  let mailingListService: MailingListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MailingListService]
    });
  });

  beforeEach(() => {
    mailingListService = TestBed.inject(MailingListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([MailingListService], (service: MailingListService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a sites paginated', async(() => {
    // fake response
    const expectedResponse: Page<MailingList> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<MailingList>;
    mailingListService.getAllMailingList(0, 10).subscribe((result: Page<MailingList>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/mailing-lists?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
