import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';

describe('ExportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportService = TestBed.inject(ExportService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
