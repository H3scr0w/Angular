import { Inject, Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import * as decode from 'jwt-decode';
import { AuthResponse } from './model/auth-response';
import { Credentials } from './model/credentials';
import { Jwt } from './model/jwt';
import { JwtInfo } from './model/jwt-info';

/**
 * The credentials key to store in storage
 */
const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {
  /**
   * The credentials
   */
  private _credentials: Credentials;
  /**
   * The base url of the SSO
   */
  private casBaseUrl: string = environment.casBaseUrl;

  /**
   * The permission group
   */
  private adminRight: string = environment.adminRight;

  /**
   * The app name in LAN
   */
  private appLanName: string = environment.appLanName;

  /**
   * Instantiate the service
   */
  constructor(@Inject(DOCUMENT) private document: Document) {
    this._credentials = JSON.parse(
      sessionStorage.getItem(credentialsKey) || (localStorage.getItem(credentialsKey) as string)
    );
  }

  /**
   * get CAS Login URL.
   */
  getLoginUrl(): string {
    return this.casBaseUrl + '/login' + '?service=' + window.location.origin;
  }

  /**
   * Parses the response params and sets the session if there was no error
   */
  processLogin(): Observable<Jwt> {
    const hash = window.location.search.substr(1);
    if (!hash) {
      return of(null!);
    }
    this.setCredentials();
    const parsedResponse: AuthResponse = this.parseParams(hash);
    if (!parsedResponse.ticket) {
      throw new Error('ticket is empty.');
    }
    const jwt: Jwt = new Jwt();
    jwt.jwt = parsedResponse.ticket;
    return of(jwt);
  }

  /**
   * Logs out the user and clear credentials.
   */
  logout(): void {
    this.setCredentials();
    this.document.location.href = this.casBaseUrl + '/logout' + '?service=' + window.location.origin;
  }

  /**
   * Checks is the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials && this.credentials.expires > this.getDate();
  }

  /**
   * Gets the user credentials.
   */
  get credentials(): Credentials {
    return this._credentials;
  }

  /**
   * Create credentials
   */
  createCredentials(jwt: Jwt): void {
    const jwtInfo: JwtInfo = decode(jwt.jwt);
    const rights: string | Array<string> = jwtInfo.accessRights;
    let accessRights: string[] = [];

    // Either an array of rights or only one right as a string
    if (rights instanceof Array) {
      accessRights = rights;
    } else {
      accessRights.push(rights);
    }

    const hasAdminAccess: boolean =
      accessRights.indexOf(this.adminRight) >= 0 && window.location.hostname === this.appLanName;

    const credentials = {
      email: jwtInfo.sub,
      expires: jwtInfo.exp,
      issued_at: jwtInfo.iat,
      accessRights,
      jwt: jwt.jwt,
      hasAdminAccess
    };
    this.setCredentials(credentials, true);
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean): void {
    this._credentials = (credentials as Credentials) || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  /**
   * Parses the params from the URL that were set by the auth server
   */
  private parseParams(path: string): AuthResponse {
    return path
      .split('&')
      .map((param) => param.split('='))
      .reduce((params, param) => {
        params[param[0]] = decodeURIComponent(param[1]);
        return params;
      }, {}) as AuthResponse;
  }

  /**
   * Returns the current timestamp as an integer of seconds since Epoch
   */
  private getDate(): number {
    return Math.floor(Date.now() / 1000);
  }
}
