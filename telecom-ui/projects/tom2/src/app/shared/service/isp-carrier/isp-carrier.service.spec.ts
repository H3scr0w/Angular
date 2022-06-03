import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IspCarrier } from '../../models/isp-carrier';
import { Page } from '../../models/page.model';
import { IspCarrierService } from './isp-carrier.service';

describe('IspCarrierService', () => {
  let ispCarrierService: IspCarrierService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IspCarrierService]
    });
  });

  beforeEach(() => {
    ispCarrierService = TestBed.inject(IspCarrierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: IspCarrierService = TestBed.inject(IspCarrierService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Isp Carrier paginated', async(() => {
    // fake response
    const expectedResponse: Page<IspCarrier> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<IspCarrier>;
    ispCarrierService
      .getAllIspCarriers(0, 10, null, '')
      .subscribe((result: Page<IspCarrier>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/isp-carriers?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
