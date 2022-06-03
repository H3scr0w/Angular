import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenModel } from '@app/shared';
import { Observable } from 'rxjs';

export interface ITokenService {
  getLink(resourceId: string): Observable<TokenModel>;

  createLink(sgid: string, email: string, captcha: string): Observable<TokenModel>;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService implements ITokenService {
  constructor(private http: HttpClient) {}

  public getLink(resourceId: string): Observable<TokenModel> {
    return this.http.get<TokenModel>(`/token/${resourceId}`);
  }

  public createLink(sgid: string, email: string, captcha: string): Observable<TokenModel> {
    const params: HttpParams = new HttpParams().set('captcha', captcha);
    return this.http.post<TokenModel>('/token', { sgid, email }, { params: params });
  }
}
