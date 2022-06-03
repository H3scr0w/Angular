import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page, Zone, ZoneHome } from '@shared';
import { ZoneService } from './zone.service';

describe('ZoneService', () => {
  let zoneService: ZoneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ZoneService]
    });
  });

  beforeEach(() => {
    zoneService = TestBed.inject(ZoneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([ZoneService], (service: ZoneService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Zone Home paginated', async(() => {
    // fake response
    const expectedResponse: Page<ZoneHome> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<ZoneHome>;
    zoneService.getAllZonesSiteCount(0, 10).subscribe((result: Page<ZoneHome>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/zones/sites-count?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Zone paginated', async(() => {
    // fake response
    const expectedResponse: Page<Zone> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Zone>;
    zoneService.getAllZones('', 0, 10).subscribe((result: Page<Zone>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/zones?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
