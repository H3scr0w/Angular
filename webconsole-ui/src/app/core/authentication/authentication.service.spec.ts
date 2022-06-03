import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { environment } from '@env/environment';
import { AuthenticationService } from './authentication.service';
import { Jwt } from './model/jwt';

const createDocument = (): Document => {
  const document = {
    location: {
      href: '',
      search: ''
    }
  };
  return document as Document;
};

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  const doc = createDocument();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService, { provide: DOCUMENT, useValue: doc }]
    });
    authenticationService = TestBed.inject(AuthenticationService);
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  describe('getLoginUrl', () => {
    it('should get the CAS login url', () => {
      const origin = window.location.origin;
      const expected = environment.casBaseUrl + '/login' + '?service=' + origin;
      const url = authenticationService.getLoginUrl();
      expect(url).toEqual(expected);
    });
  });

  describe('logout', () => {
    it('should logout', () => {
      authenticationService.logout();
      expect(authenticationService.credentials).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no credentials', () => {
      const isAuthenticated = authenticationService.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('createCredentials', () => {
    afterEach(() => {
      authenticationService.logout();
    });

    it('should create credentials as Super Admin', () => {
      const jwt: Jwt = new Jwt();
      jwt.jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWNjZXNzUmlnaHRzIjoiKjoqOkFETUlOIn0.' +
        'Vrljqng3eco8v2e5UicjHGIehYRk-CU-vsoxCYGYRCE';
      authenticationService.createCredentials(jwt);

      expect(authenticationService.credentials.email).toEqual('1234567890');
      expect(authenticationService.credentials.accessRights).toContain('*:*:ADMIN');
    });

    it('should create credentials as User Profile', () => {
      const jwt: Jwt = new Jwt();
      jwt.jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWNjZXNzUmlnaHRzIjpbInc6aXNvdmVyOk93bmVyIiwi' +
        'ZGRjOnNhaW50Z29iYWluMnYyY29yZTpCdXNpbmVzcyJdfQ.' +
        'RU7gQwmPk3CzEIG7NFeJadGCBSbPJJPwWM7wNlra8Z0';

      authenticationService.createCredentials(jwt);
      expect(authenticationService.credentials.accessRights).toContain('w:isover:Owner');
      expect(authenticationService.credentials.accessRights).toContain('ddc:saintgobain2v2core:Business');
    });
  });

  describe('processLogin', () => {
    it('should do nothing when no hash', () => {
      authenticationService.processLogin().subscribe((result: Jwt) => {
        const tokenInfo = result;
        expect(tokenInfo).toBeUndefined();
      });
    });
  });
});
