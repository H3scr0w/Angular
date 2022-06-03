import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CsvParameter } from '../../models/csv-parameter';
import { Page } from '../../models/page.model';
import { CsvParameterService } from './csv-parameter.service';

describe('ContactService', () => {
  let csvParameterService: CsvParameterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CsvParameterService]
    });
  });

  beforeEach(() => {
    csvParameterService = TestBed.inject(CsvParameterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: CsvParameterService = TestBed.inject(CsvParameterService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a CsvParameter paginated', async(() => {
    // fake response
    const expectedResponse: Page<CsvParameter> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CsvParameter>;
    csvParameterService
      .getAllCsvParameter(0, 10, null, '')
      .subscribe((result: Page<CsvParameter>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/csvParameters?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
