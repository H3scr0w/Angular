import { TestBed } from '@angular/core/testing';

import { DynamicControlService } from './dynamic-control.service';

describe('DynamicControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicControlService = TestBed.inject(DynamicControlService);
    expect(service).toBeTruthy();
  });
});
