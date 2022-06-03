import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperatorParameterDTO } from '../../models/operator-parameter';
import { Page } from '../../models/page.model';
import { OperatorParameterService } from './operator-parameter.service';

describe('OperatorparameterService', () => {
  let operatorParameterService: OperatorParameterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperatorParameterService]
    });
  });

  beforeEach(() => {
    operatorParameterService = TestBed.inject(OperatorParameterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: OperatorParameterService = TestBed.inject(OperatorParameterService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a OperatorParameters paginated', async(() => {
    // fake response
    const expectedResponse: Page<OperatorParameterDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<OperatorParameterDTO>;
    operatorParameterService
      .getAllOperatorParameters(0, 10, null, '')
      .subscribe((result: Page<OperatorParameterDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/operator-parameters?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
