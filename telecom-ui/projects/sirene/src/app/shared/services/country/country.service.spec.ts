import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Country, CountryHome, Page } from '@shared';
import { CountryService } from './country.service';

describe('CountryService', () => {
  let countryService: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService]
    });
  });

  beforeEach(() => {
    countryService = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([CountryService], (service: CountryService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Country Home paginated', async(() => {
    // fake response
    const expectedResponse: Page<CountryHome> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CountryHome>;
    countryService.getAllCountriesSiteCount(0, 10).subscribe((result: Page<CountryHome>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/countries/sites-count?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Country paginated', async(() => {
    // fake response
    const expectedResponse: Page<Country> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Country>;
    countryService.getAllCountries('', 0, 10).subscribe((result: Page<Country>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/countries?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
