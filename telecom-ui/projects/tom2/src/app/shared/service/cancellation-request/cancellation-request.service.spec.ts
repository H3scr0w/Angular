import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CancellationRequestService } from './cancellation-request.service';

describe('CancellationRequestService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CancellationRequestService]
    })
  );

  it('should be created', () => {
    const service: CancellationRequestService = TestBed.inject(CancellationRequestService);
    expect(service).toBeTruthy();
  });
});
