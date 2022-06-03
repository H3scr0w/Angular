import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeploymentService } from './deployment.service';

describe('DeploymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeploymentService]
    });
  });

  it('should be created', () => {
    const service: DeploymentService = TestBed.inject(DeploymentService);
    expect(service).toBeTruthy();
  });
});
