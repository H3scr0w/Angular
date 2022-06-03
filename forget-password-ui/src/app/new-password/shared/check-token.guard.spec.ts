import { inject } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setUpTestBed } from 'test.common.spec';
import { MockStore } from '../../../testing/mock-store.component';
import { RouterStub } from '../../../testing/router-stubs';
import { CheckTokenGuard } from './check-token.guard';

describe('CheckTokenGuard', () => {
  setUpTestBed({
    imports: [HttpClientTestingModule],
    providers: [CheckTokenGuard, { provide: Store, useClass: MockStore }, { provide: Router, useClass: RouterStub }]
  });

  it('should ...', inject([CheckTokenGuard], (guard: CheckTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
