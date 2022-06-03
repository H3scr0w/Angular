import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page, SiteType } from '@shared';
import { SiteTypeService } from './site-type.service';

describe('SiteTypeService', () => {
  let siteTypeService: SiteTypeService;
  let httpMock: HttpTestingController;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiteTypeService]
    })
  );

  beforeEach(() => {
    siteTypeService = TestBed.inject(SiteTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: SiteTypeService = TestBed.inject(SiteTypeService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a sites types paginated', async(() => {
    // fake response
    const expectedResponse: Page<SiteType> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<SiteType>;
    siteTypeService.getAllSiteTypes('', 0, 10).subscribe((result: Page<SiteType>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/site-types?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
