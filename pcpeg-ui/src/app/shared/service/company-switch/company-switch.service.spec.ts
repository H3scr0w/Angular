import { TestBed } from '@angular/core/testing';

import { CompanySwitchService } from './company-switch.service';

describe('CompanySwitchService', () => {
  let service: CompanySwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanySwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
