import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IspInformation } from '../../models/isp-information';
import { Page } from '../../models/page.model';
import { IspBandwidthService } from './isp-bandwidth.service';

describe('IspBandwidthService', () => {
  let ispBandwidthService: IspBandwidthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IspBandwidthService]
    });
  });

  beforeEach(() => {
    ispBandwidthService = TestBed.inject(IspBandwidthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: IspBandwidthService = TestBed.inject(IspBandwidthService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a IspInformation paginated', async(() => {
    // fake response
    const expectedResponse: Page<IspInformation> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<IspInformation>;
    ispBandwidthService
      .getAllIspBandwidths('', 0, 10, '', '', null)
      .subscribe((result: Page<IspInformation>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/isp-bandwidths?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
