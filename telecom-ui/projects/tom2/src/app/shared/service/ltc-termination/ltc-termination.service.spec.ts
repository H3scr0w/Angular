import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LtcTerminationDTO } from '../../models/ltc-termination';
import { Page } from '../../models/page.model';
import { LtcTerminationService } from './ltc-termination.service';

describe('LtcTerminationService', () => {
  let ltcTerminationService: LtcTerminationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LtcTerminationService]
    });
  });

  beforeEach(() => {
    ltcTerminationService = TestBed.inject(LtcTerminationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: LtcTerminationService = TestBed.inject(LtcTerminationService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a LtcTermination paginated', async(() => {
    // fake response
    const expectedResponse: Page<LtcTerminationDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<LtcTerminationDTO>;
    ltcTerminationService
      .getAllLtcTermination(0, 10, null, '')
      .subscribe((result: Page<LtcTerminationDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/ltc-terminations?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
