import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PasswordModel } from '../new-password/shared/password.model';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  constructor(private http: HttpClient) {}

  public updatePassword(passwordReset: PasswordModel): Observable<string> {
    return this.http.put<string>('/persons', passwordReset);
  }
}
