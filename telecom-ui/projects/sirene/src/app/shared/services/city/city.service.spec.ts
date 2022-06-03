import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { City, Page } from '@shared';
import { CityService } from './city.service';

describe('CityService', () => {
  let cityService: CityService;
  let httpMock: HttpTestingController;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CityService]
    })
  );

  beforeEach(() => {
    cityService = TestBed.inject(CityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: CityService = TestBed.inject(CityService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a City paginated', async(() => {
    // fake response
    const expectedResponse: Page<City> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<City>;
    cityService.getAllCities(0, 10, null, '').subscribe((result: Page<City>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/cities?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
