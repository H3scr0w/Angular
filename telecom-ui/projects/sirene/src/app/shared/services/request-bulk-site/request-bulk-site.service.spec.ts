import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RequestBulkSiteService } from './request-bulk-site.service';

describe('RequestBulkSiteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RequestBulkSiteService]
    });
  });

  it('should be created', () => {
    const service: RequestBulkSiteService = TestBed.inject(RequestBulkSiteService);
    expect(service).toBeTruthy();
  });
});
