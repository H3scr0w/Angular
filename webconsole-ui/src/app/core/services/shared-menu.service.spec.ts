import { TestBed } from '@angular/core/testing';

import { SharedMenuService } from './shared-menu.service';

describe('SharedMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedMenuService = TestBed.inject(SharedMenuService);
    expect(service).toBeTruthy();
  });
});
