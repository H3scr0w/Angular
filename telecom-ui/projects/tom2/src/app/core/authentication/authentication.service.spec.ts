import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { environment } from '@env/environment';
import { AuthenticationService } from './authentication.service';
import { Jwt } from './model/jwt';
import { TokenInfo } from './model/token-info';

const createDocument = (): any => {
  const document = {
    location: {
      href: '',
      search: ''
    }
  };
  return document as any;
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

  describe('getAuthorizationRequestUrl', () => {
    it('should get the authorization request url', () => {
      const origin = window.location.origin;
      const expected =
        environment.apiBaseUrl +
        environment.apiContextPath +
        '/request' +
        '?client_id=' +
        environment.clientId +
        '&consumer_uri=' +
        origin;
      const url = authenticationService.getAuthorizationRequestUrl();
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
    xit('should create credentials without attribute', () => {
      const jwt: Jwt = new Jwt();
      jwt.jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      const tokenInfo: TokenInfo = new TokenInfo();
      tokenInfo.access_token = 'SGID';
      tokenInfo.expires_in = new Date().getTime();
      tokenInfo.refresh_token = 'SGID';
      tokenInfo.id_token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.' +
        'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      authenticationService.createCredentials(tokenInfo, jwt);

      expect(authenticationService.credentials.sgid).toEqual('1234567890');
    });
  });

  describe('processLogin', () => {
    it('should do nothing when no hash', () => {
      authenticationService.processLogin().subscribe((result: [TokenInfo, Jwt]) => {
        const tokenInfo = result[0];
        expect(tokenInfo.access_token).toBe(undefined);
      });
    });
  });
});
