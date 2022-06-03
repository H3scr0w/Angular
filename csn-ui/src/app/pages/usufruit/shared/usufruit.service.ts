import {Injectable} from '@angular/core';
import {UsufruitCalcul} from './usufruit-calcul.model';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {UsufruitRestit} from './usufruit-restit.model';
import {environment} from '../../../../environments/environment';
import {Constants} from '../../../shared/constants';
import {CalculWithRestit} from './calcul-with-restit.model';

@Injectable({
  providedIn: 'root',
})
export class UsufruitService {

  private subject = new Subject<CalculWithRestit>();
  subject$ = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  reset() {
    this.subject.next();
  }

  post(usufruit: UsufruitCalcul) {
    this.postApi(usufruit).subscribe(response => {
      // Build a CalculWithRestit Object so the restitComponent can access calcul data
      this.subject.next(new CalculWithRestit(usufruit, response));
    }, error => {
    });
  }

  postApi(usufruit: UsufruitCalcul): Observable<UsufruitRestit> {
    return this.httpClient.post<UsufruitRestit>(environment.apiUrl + '/usufruit/calcul'
      , usufruit, Constants.httpOptions);
  }

  export(calculWithRestit: CalculWithRestit): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/usufruit/export',
      calculWithRestit, Constants.httpExportOptions);
  }
}
