import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {RachatRenteViagereRestit} from './rachat-rente-viagere-restit.model';
import {RachatRenteViagereCalcul} from './rachat-rente-viagere-calcul.model';
import {Constants} from '../../../shared/constants';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Injectable({
  providedIn: 'root',
})
export class RachatRenteViagereService {

  private subject = new Subject<CalculWithRestit>();
  subject$ = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  post(rachatRenteViagereCalcul: RachatRenteViagereCalcul) {
    this.postApi(rachatRenteViagereCalcul).subscribe(response => {
      // Build a CalculWithRestit Object so the restitComponent can access calcul data
      this.subject.next(new CalculWithRestit(rachatRenteViagereCalcul, response));
    }, error => {
    });
  }

  postApi(rachatRenteViagereCalcul: RachatRenteViagereCalcul): Observable<RachatRenteViagereRestit> {
    return this.httpClient.post<RachatRenteViagereRestit>(environment.apiUrl
      + '/rachat-rente/calcul', rachatRenteViagereCalcul, Constants.httpOptions);
  }

  getTauxRevalorisationRente(dateContrat: any): any {
    return this.httpClient.get<string>(environment.apiUrl + '/rachat-rente/taux?date=' + dateContrat);
  }

  export(calculWithRestit: CalculWithRestit): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/rachat-rente/export',
      calculWithRestit, Constants.httpExportOptions);
  }
}
