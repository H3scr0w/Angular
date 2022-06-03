import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Operator } from '../../models/operators';
import { Page } from '../../models/page.model';
import { OperatorsService } from './operators.service';

describe('ContactService', () => {
  let operatorsService: OperatorsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperatorsService]
    });
  });

  beforeEach(() => {
    operatorsService = TestBed.inject(OperatorsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: OperatorsService = TestBed.inject(OperatorsService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Operators paginated', async(() => {
    // fake response
    const expectedResponse: Page<Operator> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Operator>;
    operatorsService.getAllOperators(0, 10, null, '').subscribe((result: Page<Operator>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/common/operators?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
