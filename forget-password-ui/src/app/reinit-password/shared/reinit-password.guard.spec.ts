import { inject } from '@angular/core/testing';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setUpTestBed } from 'test.common.spec';
import { MockStore } from '../../../testing/mock-store.component';
import { RouterStub } from '../../../testing/router-stubs';
import { ReinitPasswordGuard } from './reinit-password.guard';

describe('ReinitPasswordGuard', () => {
  setUpTestBed({
    providers: [ReinitPasswordGuard, { provide: Store, useClass: MockStore }, { provide: Router, useClass: RouterStub }]
  });

  it('should ...', inject([ReinitPasswordGuard], (guard: ReinitPasswordGuard) => {
    expect(guard).toBeTruthy();
  }));
});
