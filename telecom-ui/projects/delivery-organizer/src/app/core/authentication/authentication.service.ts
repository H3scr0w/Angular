import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DOCUMENT } from '@angular/common';
import * as decode from 'jwt-decode';
import includes from 'lodash/includes';
import * as Pako from 'pako';
import { environment } from '../../../environments/environment';
import { AuthResponse } from './model/auth-response';
import { Credentials } from './model/credentials';
import { Jwt } from './model/jwt';
import { JwtInfo } from './model/jwt-info';
import { TokenInfo } from './model/token-info';

/**
 * The credentials key to store in storage
 */
const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  /**
   * The credentials
   */
  private _credentials: Credentials;
  /**
   * The base url of the SSO
   */
  private oauthBaseUrl: string = environment.oauthBaseUrl;
  /**
   * The base url of the API Management
   */
  private apiBaseUrl: string = environment.apiBaseUrl;

  /**
   * The context path of the API Management
   */
  private apiContextPath: string = environment.apiContextPath;
  /**
   * The clientId
   */
  private clientId: string = environment.clientId;
  /**
   * The client secret
   */
  private clientSecret: string = environment.clientSecret;
  /**
   * The api token path
   */
  private apiTokenPath: string = environment.apiTokenPath;
  /**
   * The user group
   */
  private userGroup: string = environment.userGroup;
  /**
   * The modify group
   */
  private modifyGroup: string = environment.modifyGroup;
  /**
   * The supervisor group
   */
  private supervisorGroup: string = environment.supervisorGroup;
  /**
   * The super admin group
   */
  private adminGroup: string = environment.adminGroup;
  /**
   * The admin group
   */
  private doAdminGroup: string = environment.doAdminGroup;

  /**
   * Instantiate the service
   */
  constructor(@Inject(DOCUMENT) private document: any, private http: HttpClient) {
    this._credentials = JSON.parse(sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey));
  }

  /**
   * Retrieve the authorization url from oAuth server.
   */
  getAuthorizationRequestUrl(): string {
    return (
      this.apiBaseUrl +
      this.apiContextPath +
      '/request' +
      '?client_id=' +
      this.clientId +
      '&consumer_uri=' +
      window.location.origin
    );
  }

  /**
   * Parses the response params and sets the session if there was no error
   */
  processLogin(): Observable<[TokenInfo, Jwt]> {
    const hash = window.location.search.substr(1);
    if (!hash) {
      return forkJoin([of(new TokenInfo()), of(new Jwt())]);
    }
    this.setCredentials();
    const parsedResponse: AuthResponse = this.parseParams(hash);
    if (!parsedResponse.SAMLart) {
      throw new Error('SAMLart is empty.');
    }

    const urlAccessToken = this.apiContextPath + '/token';

    const body: HttpParams = new HttpParams()
      .set('saml_art', encodeURIComponent(parsedResponse.SAMLart))
      .set('client_secret', encodeURIComponent(this.clientSecret))
      .set('consumer_uri', encodeURIComponent(window.location.origin));

    const headers: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http
      .post<TokenInfo>(urlAccessToken, body, { headers })
      .pipe(
        switchMap((tokenInfo: TokenInfo) => {
          const jwtHeaders: HttpHeaders = new HttpHeaders().set('Authorization', 'Bearer ' + tokenInfo.access_token);
          return forkJoin([of(tokenInfo), this.http.get<Jwt>(this.apiTokenPath, { headers: jwtHeaders })]);
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   */
  logout(): void {
    this.setCredentials();
    this.document.location.href = this.oauthBaseUrl + '/logout';
  }

  /**
   * Checks is the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials && this.credentials.expires + this.credentials.issued_at > this.getDate();
  }

  /**
   * Checks if user is authorized
   */
  isBelongGroup(): boolean {
    return this.isUser() || this.isModifyUser() || this.isSupervisor() || this.isAdmin();
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
  createCredentials(tokenInfo: TokenInfo, jwt: Jwt): void {
    const jwtInfo: JwtInfo = decode(jwt.jwt);
    const decoded = atob(jwtInfo.groups);
    const groupString = Pako.inflate(decoded, { to: 'string' });
    const groups = groupString.split(';');
    const isAdmin = includes(groups, this.adminGroup) || includes(groups, this.doAdminGroup);
    const isModifyUser = includes(groups, this.modifyGroup);
    const isSupervisor = includes(groups, this.supervisorGroup);

    const credentials = {
      sgid: jwtInfo.sub,
      token: tokenInfo.access_token,
      expires: tokenInfo.expires_in,
      issued_at: this.getDate(),
      groups,
      jwt: jwt.jwt,
      isAdmin,
      isModifyUser,
      isSupervisor
    };
    this.setCredentials(credentials, true);
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

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
      .map(param => param.split('='))
      .reduce((params, param) => {
        params[param[0]] = decodeURIComponent(decodeURIComponent(param[1]));
        return params;
      }, {}) as AuthResponse;
  }

  /**
   * Returns the current timestamp as an integer of seconds since Epoch
   */
  private getDate(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Checks if user has minimal rights
   */
  private isUser(): boolean {
    return includes(this.credentials.groups, this.userGroup);
  }

  /**
   * Checks if user has Modify rights
   */
  private isModifyUser(): boolean {
    return includes(this.credentials.groups, this.modifyGroup);
  }

  /**
   * Checks if user has Supervisor rights
   */
  private isSupervisor(): boolean {
    return includes(this.credentials.groups, this.supervisorGroup);
  }

  /**
   * Checks if user has admin rights
   */
  private isAdmin(): boolean {
    return includes(this.credentials.groups, this.adminGroup) || includes(this.credentials.groups, this.doAdminGroup);
  }
}
