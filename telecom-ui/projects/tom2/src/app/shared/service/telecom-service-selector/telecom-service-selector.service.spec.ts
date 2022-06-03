import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Page } from '../../models/page.model';
import { TelecomService } from '../../models/telecom-service-selector';
import { TelecomServiceSelectorService } from './telecom-service-selector.service';

describe('TelecomServiceSelectorService', () => {
  let telecomServiceSelectorService: TelecomServiceSelectorService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TelecomServiceSelectorService]
    })
  );

  beforeEach(() => {
    telecomServiceSelectorService = TestBed.inject(TelecomServiceSelectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: TelecomServiceSelectorService = TestBed.inject(TelecomServiceSelectorService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a TelecomService paginated', async(() => {
    // fake response
    const expectedResponse: Page<TelecomService> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<TelecomService>;
    telecomServiceSelectorService
      .getTelecomServices(0, 10, '', '', '', null)
      .subscribe((result: Page<TelecomService>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/catalogs/services?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
