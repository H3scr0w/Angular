import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {MentionsLegalesModel} from './mentions-legales.model';

@Injectable({
  providedIn: 'root',
})
export class MentionsLegalesService {
  constructor(private httpClient: HttpClient) {
  }
  get(): Observable<MentionsLegalesModel> {
    return this.httpClient.get<MentionsLegalesModel>(environment.apiUrl + '/mentions-legales');
  }
}
