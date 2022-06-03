import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Networks } from '../../models/networks.model';
import { Page } from '../../models/page.model';
import { NetworksService } from './networks.service';

describe('NetworksService', () => {
  let networksService: NetworksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NetworksService]
    });
  });

  beforeEach(() => {
    networksService = TestBed.inject(NetworksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([NetworksService], (service: NetworksService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Networks paginated', async(() => {
    // fake response
    const expectedResponse: Page<Networks> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Networks>;
    networksService
      .getAllNetworks('', 0, 10, '', '', null)
      .subscribe((result: Page<Networks>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/common/networks?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
