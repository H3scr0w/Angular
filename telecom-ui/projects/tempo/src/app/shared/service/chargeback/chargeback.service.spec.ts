import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Chargeback } from '../../models/chargeback';
import { Page } from '../../models/page.model';
import { ChargebackService } from './chargeback.service';

describe('ChargebackService', () => {
  let chargebackService: ChargebackService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChargebackService]
    })
  );

  beforeEach(() => {
    chargebackService = TestBed.inject(ChargebackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ChargebackService = TestBed.inject(ChargebackService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Chargeback paginated', async(() => {
    // fake response
    const expectedResponse: Page<Chargeback> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Chargeback>;
    chargebackService.getAllChargebacks(0, 10).subscribe((result: Page<Chargeback>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/chargebacks?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
