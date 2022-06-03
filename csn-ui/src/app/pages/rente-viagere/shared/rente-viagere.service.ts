import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {RenteViagereCalcul} from './rente-viagere-calcul.model';
import {RenteViagereRestit} from './rente-viagere-restit.model';
import {Constants} from '../../../shared/constants';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Injectable({
  providedIn: 'root',
})
export class RenteViagereService {

  private subject = new Subject<CalculWithRestit>();
  subject$ = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  reset(): void {
    this.subject.next();
  }

  post(renteViagereCalcul: RenteViagereCalcul) {
    this.postApi(renteViagereCalcul).subscribe(response => {
      // Build a CalculWithRestit Object so the restitComponent can access calcul data
      this.subject.next(new CalculWithRestit(renteViagereCalcul, response));
    }, error => {
    });
  }

  postApi(renteViagereCalcul: RenteViagereCalcul): Observable<RenteViagereRestit> {
    return this.httpClient.post<RenteViagereRestit>(environment.apiUrl
      + '/rente/calcul', renteViagereCalcul, Constants.httpOptions);
  }

  export(calculWithRestit: CalculWithRestit): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/rente/export',
      calculWithRestit, Constants.httpExportOptions);
  }
}
