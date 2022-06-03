import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogDiscount } from '../../models/catalog-discount';
import { CatalogDiscountService } from './catalog-discount.service';

describe('CatalogDiscountService', () => {
  let catalogDiscountService: CatalogDiscountService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogDiscountService]
    })
  );

  beforeEach(() => {
    catalogDiscountService = TestBed.inject(CatalogDiscountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: CatalogDiscountService = TestBed.inject(CatalogDiscountService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Catalog Discount', async(() => {
    // fake response
    const expectedResponse: CatalogDiscount = {
      applicabilityDate: '2019-12-10',
      catalogId: 1,
      id: 1,
      mrcAnniversary: 0,
      mrcDiscountRate: 0,
      otcAnniversary: 0,
      otcDiscountRate: 0
    };

    // call the service
    let actualResponse: CatalogDiscount;
    catalogDiscountService.getCatalogDiscount(1).subscribe((result: CatalogDiscount) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/discounts/catalogs/1')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
