import { inject, TestBed } from '@angular/core/testing';

import { AuthenticationService, Route } from '@core';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { UserGroupGuard } from './user-group.guard';

describe('UserGroupGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserGroupGuard, Route, { provide: AuthenticationService, useClass: MockAuthenticationService }]
    });
  });

  it('should ...', inject([UserGroupGuard], (guard: UserGroupGuard) => {
    expect(guard).toBeTruthy();
  }));
});
