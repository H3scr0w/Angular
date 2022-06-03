import { async, inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Networks } from '../../models/networks.model';
import { OperatorMailTemplate } from '../../models/operator-mail-template.model';
import { Page } from '../../models/page.model';
import { OperatorMailTemplateService } from './operator-mail-template.service';

describe('OperatorMailTemplateService', () => {
  let operatorMailTemplateService: OperatorMailTemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OperatorMailTemplateService]
    });
  });

  beforeEach(() => {
    operatorMailTemplateService = TestBed.inject(OperatorMailTemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([OperatorMailTemplateService], (service: OperatorMailTemplateService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Operator Mail Templates paginated', async(() => {
    // fake response
    const expectedResponse: Page<OperatorMailTemplate> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<OperatorMailTemplate>;
    operatorMailTemplateService
      .getAllMailTemplates(null, 0, 10, '', '')
      .subscribe((result: Page<OperatorMailTemplate>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/operator-mail-templates?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Networks paginated', async(() => {
    // fake response
    const expectedResponse: Page<Networks> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Networks>;
    operatorMailTemplateService
      .getAllNetworks(0, 10, '', '', null)
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
