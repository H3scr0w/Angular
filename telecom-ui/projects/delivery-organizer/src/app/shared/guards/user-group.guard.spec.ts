import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService, Route } from '../../core';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { UserGroupGuard } from './user-group.guard';

describe('UserGroupGuard', () => {
  let mockRouter: any;
  beforeEach(() => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      providers: [
        UserGroupGuard,
        Route,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should ...', inject([UserGroupGuard], (guard: UserGroupGuard) => {
    expect(guard).toBeTruthy();
  }));
});
