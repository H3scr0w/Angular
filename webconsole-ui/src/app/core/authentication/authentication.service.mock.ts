import { of, Observable } from 'rxjs';
import { Credentials } from './model/credentials';
import { Jwt } from './model/jwt';

export class MockAuthenticationService {
  authenticated = true;

  hasUserInfo = true;

  _credentials?: Credentials = {
    email: 'test@saint-gobain.com',
    expires: 123,
    accessRights: [],
    issued_at: 123,
    jwt: '',
    hasAdminAccess: false
  };

  get credentials(): Credentials | undefined {
    if (this.authenticated) {
      return this._credentials;
    } else {
      return undefined;
    }
  }

  set credentials(credentials: Credentials | undefined) {
    this._credentials = credentials;
  }

  getLoginUrl(): string {
    return 'getLoginUrl';
  }

  processLogin(): Observable<Jwt> {
    const jwt: Jwt = new Jwt();
    return of(jwt);
  }

  logout(): void {
    this.credentials = undefined;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  createCredentials(jwt: Jwt): void {}
}
