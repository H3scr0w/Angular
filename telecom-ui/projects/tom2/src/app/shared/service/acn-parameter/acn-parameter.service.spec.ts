import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AcnParameterDTO } from '../../models/acn-parameter';
import { Page } from '../../models/page.model';
import { AcnParameterService } from './acn-parameter.service';

describe('AcnParameterService', () => {
  let acnParameterService: AcnParameterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AcnParameterService]
    });
  });

  beforeEach(() => {
    acnParameterService = TestBed.inject(AcnParameterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: AcnParameterService = TestBed.inject(AcnParameterService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a OperatorParameters paginated', async(() => {
    // fake response
    const expectedResponse: Page<AcnParameterDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<AcnParameterDTO>;
    acnParameterService
      .getAllAcnParameters(0, 10, null, '')
      .subscribe((result: Page<AcnParameterDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/acn-parameters?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
