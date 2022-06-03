import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { CompanyRequest } from '../../models/company-request';
import { CompanyRequestService } from './company-request.service';

describe('CompanyRequestService', () => {
  let companyRequestService: CompanyRequestService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyRequestService]
    });

    companyRequestService = TestBed.inject(CompanyRequestService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: CompanyRequestService = TestBed.inject(CompanyRequestService);
    expect(service).toBeTruthy();
  });

  it('should return a  Company Request List', async(() => {
    // fakse rsponse
    const expectedResponse: Page<CompanyRequest> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CompanyRequest>;
    companyRequestService
      .getAllCompanyRequests(0, 10)
      .subscribe((result: Page<CompanyRequest>) => (actualResponse = result));

    httpTestingController.expectOne('/company-requests?page=0&size=10').flush(expectedResponse);

    // Run our tests
    expect(actualResponse).toBe(expectedResponse);
  }));
});
