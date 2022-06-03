import { TestBed } from '@angular/core/testing';

import { TenantAccountService } from './tenant-account.service';

describe('TenantAccountService', () => {
  let service: TenantAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
