import {CookieService} from 'ngx-cookie-service';
import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {UserInfo} from '../models/users';
import {BehaviorSubject, Observable} from 'rxjs';
import {Person} from '../models/person';
import {ApiNotarialeService} from './api-notariale.service';
import {DOCUMENT, PlatformLocation} from '@angular/common';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<Person>;
  public currentUser: Observable<Person>;

  constructor(private cookieService: CookieService, private httpClient: HttpClient,
              private apiNotarialeService: ApiNotarialeService,
              private platformLocation: PlatformLocation,
              @Inject(DOCUMENT) private document: Document) {
    this.currentUserSubject = new BehaviorSubject<Person>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /**
   * Get Logged in user info and generate cookies thanks to apache
   */
  getUserInfoAndSetCookies(): Observable<UserInfo> {
    return this.httpClient.get<UserInfo>('/callback?info=json');
  }

  setCurrentUser(personId: string) {
    return this.apiNotarialeService.getPersonInfo(personId).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }, () => {
      }));
  }

  logOut() {
    const appPath = (this.platformLocation as any).location.origin;
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.document.location.href = appPath + '/callback?logout=' + appPath;
  }
}
