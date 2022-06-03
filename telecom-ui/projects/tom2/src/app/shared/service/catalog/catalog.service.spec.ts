import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Catalog } from '../../models/catalog';
import { Page } from '../../models/page.model';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let operatorsService: CatalogService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatalogService]
    });
  });

  beforeEach(() => {
    operatorsService = TestBed.inject(CatalogService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: CatalogService = TestBed.inject(CatalogService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Catalogs paginated', async(() => {
    // fake response
    const expectedResponse: Page<Catalog> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Catalog>;
    operatorsService.getAllCatalogs(0, 10, null, '').subscribe((result: Page<Catalog>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/catalogs?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
