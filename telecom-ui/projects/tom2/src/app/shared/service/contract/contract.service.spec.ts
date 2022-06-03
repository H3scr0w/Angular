import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContractDTO } from '../../models/contracts';
import { Page } from '../../models/page.model';
import { ContractService } from './contract.service';

describe('ContactService', () => {
  let contractService: ContractService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContractService]
    });
  });

  beforeEach(() => {
    contractService = TestBed.inject(ContractService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ContractService = TestBed.inject(ContractService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Operators paginated', async(() => {
    // fake response
    const expectedResponse: Page<ContractDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<ContractDTO>;
    contractService.getAllContract(0, 10, null, '').subscribe((result: Page<ContractDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/contracts?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
