import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { CostUpperLimit } from '../../models/cost-upper-limit.model';
import { Page } from '../../models/page.model';
import { CostUpperLimitService } from './cost-upper-limit.service';

describe('CostUpperLimitService', () => {
  let costUpperLimitService: CostUpperLimitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CostUpperLimitService]
    });
  });

  beforeEach(() => {
    costUpperLimitService = TestBed.inject(CostUpperLimitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([CostUpperLimitService], (service: CostUpperLimitService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Cost Upper Limits paginated', async(() => {
    // fake response
    const expectedResponse: Page<CostUpperLimit> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CostUpperLimit>;
    costUpperLimitService
      .getAllCostUpperLimits(null, 0, 10, '', '')
      .subscribe((result: Page<CostUpperLimit>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/cost-upper-limits?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
