import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page, Sector, SectorHome } from '@shared';
import { SectorService } from './sector.service';

describe('SectorService', () => {
  let sectorService: SectorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SectorService]
    });
  });

  beforeEach(() => {
    sectorService = TestBed.inject(SectorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([SectorService], (service: SectorService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Sector Home paginated', async(() => {
    // fake response
    const expectedResponse: Page<SectorHome> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<SectorHome>;
    sectorService.getAllSectorsSiteCount(0, 10).subscribe((result: Page<SectorHome>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/sectors/sites-count?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Sector paginated', async(() => {
    // fake response
    const expectedResponse: Page<Sector> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Sector>;
    sectorService.getAllSectors('', 0, 10).subscribe((result: Page<Sector>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/sectors?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
