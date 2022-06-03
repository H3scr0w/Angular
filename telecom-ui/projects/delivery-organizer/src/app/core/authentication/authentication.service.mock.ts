import { forkJoin, of, Observable } from 'rxjs';

import { Credentials } from './model/credentials';
import { Jwt } from './model/jwt';
import { TokenInfo } from './model/token-info';

export class MockAuthenticationService {
  authenticated = true;

  hasUserInfo = true;

  _credentials: Credentials = {
    sgid: 'test',
    token: '123',
    expires: 123,
    groups: [],
    issued_at: 123,
    jwt: '',
    isAdmin: true,
    isModifyUser: false,
    isSupervisor: false
  };

  get credentials() {
    if (this.authenticated) {
      return this._credentials;
    } else {
      return null;
    }
  }

  set credentials(credentials: Credentials) {
    this._credentials = credentials;
  }

  getAuthorizationRequestUrl(): string {
    return 'getAuthorizationRequestUrl';
  }

  processLogin(): Observable<[TokenInfo, Jwt]> {
    const tokenInfo: TokenInfo = new TokenInfo();
    if (this.hasUserInfo) {
      tokenInfo.access_token = 'TOTO';
      tokenInfo.expires_in = new Date().getTime();
      tokenInfo.id_token = 'AA';
      tokenInfo.refresh_token = 'TOTO';
    }
    const jwt: Jwt = new Jwt();
    return forkJoin([of(tokenInfo), of(jwt)]);
  }

  logout(): void {
    this.credentials = null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isBelongGroup(): boolean {
    return true;
  }

  createCredentials(tokenInfo: TokenInfo, jwt: Jwt): void {}
}
