import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Delegation, Page } from '@shared';
import { DelegationService } from './delegation.service';

describe('DelegationService', () => {
  let delegationService: DelegationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DelegationService]
    });

    delegationService = TestBed.inject(DelegationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(delegationService).toBeTruthy();
  });

  it('should return a Delgation List', async(() => {
    // fakse rsponse
    const expectedResponse: Page<Delegation> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Delegation>;
    delegationService
      .getAllDelegations('', null, 0, 10)
      .subscribe((result: Page<Delegation>) => (actualResponse = result));

    httpTestingController.expectOne('/delegations?page=0&size=10').flush(expectedResponse);

    // Run our tests
    expect(actualResponse).toBe(expectedResponse);
  }));
});
