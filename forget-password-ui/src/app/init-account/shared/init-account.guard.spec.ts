import { inject } from '@angular/core/testing';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setUpTestBed } from 'test.common.spec';
import { MockStore } from '../../../testing/mock-store.component';
import { RouterStub } from '../../../testing/router-stubs';
import { InitAccountGuard } from './init-account.guard';

describe('InitAccountGuard', () => {
  setUpTestBed({
    providers: [InitAccountGuard, { provide: Store, useClass: MockStore }, { provide: Router, useClass: RouterStub }]
  });

  it('should ...', inject([InitAccountGuard], (guard: InitAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});
