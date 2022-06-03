import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { AuthenticationGuard } from './authentication.guard';
import { AuthenticationService } from './authentication.service';
import { MockAuthenticationService } from './authentication.service.mock';

const createDocument = (): any => {
  const document = {
    location: {
      href: ''
    }
  };
  return document as any;
};

describe('AuthenticationGuard', () => {
  describe('authenticated', () => {
    let authenticationGuard: AuthenticationGuard;
    let mockRouter: any;
    let doc = createDocument();

    beforeEach(() => {
      mockRouter = {
        navigate: jasmine.createSpy('navigate')
      };
      TestBed.configureTestingModule({
        providers: [
          AuthenticationGuard,
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: Router, useValue: mockRouter },
          { provide: DOCUMENT, useValue: doc }
        ]
      });
    });

    beforeEach(inject(
      [AuthenticationGuard, AuthenticationService, DOCUMENT],
      (_authenticationGuard: AuthenticationGuard, _document: any) => {
        authenticationGuard = _authenticationGuard;
        doc = _document;
      }
    ));

    it('should have a canActivate method', () => {
      expect(typeof authenticationGuard.canActivate).toBe('function');
    });

    it('should return true', () => {
      authenticationGuard.canActivate().subscribe(resp => {
        expect(resp).toBeTruthy();
      });
    });
  });

  describe('not authenticated with user info', () => {
    let authenticationGuard: AuthenticationGuard;
    let authenticationService: MockAuthenticationService = new MockAuthenticationService();
    authenticationService.authenticated = false;
    let mockRouter: any;
    let doc = createDocument();

    beforeEach(() => {
      mockRouter = {
        navigate: jasmine.createSpy('navigate')
      };
      TestBed.configureTestingModule({
        providers: [
          AuthenticationGuard,
          { provide: AuthenticationService, useValue: authenticationService },
          { provide: Router, useValue: mockRouter },
          { provide: DOCUMENT, useValue: doc }
        ]
      });
    });

    beforeEach(inject(
      [AuthenticationGuard, AuthenticationService, DOCUMENT],
      (
        _authenticationGuard: AuthenticationGuard,
        _authenticationService: MockAuthenticationService,
        _document: any
      ) => {
        authenticationGuard = _authenticationGuard;
        authenticationService = _authenticationService;
        doc = _document;
      }
    ));

    it('should return true', () => {
      authenticationGuard.canActivate().subscribe(resp => {
        expect(resp).toBeTruthy();
      });
    });
  });

  describe('not authenticated without user info', () => {
    let authenticationGuard: AuthenticationGuard;
    let authenticationService: MockAuthenticationService = new MockAuthenticationService();
    authenticationService.authenticated = false;
    authenticationService.hasUserInfo = false;
    let mockRouter: any;
    let doc = createDocument();

    beforeEach(() => {
      mockRouter = {
        navigate: jasmine.createSpy('navigate')
      };
      TestBed.configureTestingModule({
        providers: [
          AuthenticationGuard,
          { provide: AuthenticationService, useValue: authenticationService },
          { provide: Router, useValue: mockRouter },
          { provide: DOCUMENT, useValue: doc }
        ]
      });
    });

    beforeEach(inject(
      [AuthenticationGuard, AuthenticationService, DOCUMENT],
      (
        _authenticationGuard: AuthenticationGuard,
        _authenticationService: MockAuthenticationService,
        _document: any
      ) => {
        authenticationGuard = _authenticationGuard;
        authenticationService = _authenticationService;
        doc = _document;
      }
    ));

    it('should return false and redirect', () => {
      authenticationGuard.canActivate().subscribe(resp => {
        expect(resp).toBeFalsy();
      });
    });
  });
});
