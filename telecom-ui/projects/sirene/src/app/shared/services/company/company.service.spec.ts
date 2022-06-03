import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Company, CompanyHome, Page } from '@shared';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService]
    });
  });

  beforeEach(() => {
    companyService = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([CompanyService], (service: CompanyService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a Company Home paginated', async(() => {
    // fake response
    const expectedResponse: Page<CompanyHome> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CompanyHome>;
    companyService.getAllCompaniesSiteCount(0, 10).subscribe((result: Page<CompanyHome>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/companies/sites-count?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of a Company paginated', async(() => {
    // fake response
    const expectedResponse: Page<Company> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Company>;
    companyService.getAllCompanies('', 0, 10).subscribe((result: Page<Company>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/companies?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
