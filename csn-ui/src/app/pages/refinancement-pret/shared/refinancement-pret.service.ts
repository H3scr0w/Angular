import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {RefinancementPretRestit} from './refinancement-pret-restit.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Constants} from '../../../shared/constants';
import {RefinancementPretCalcul} from './refinancement-pret-calcul.model';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Injectable({
  providedIn: 'root',
})
export class RefinancementPretService {

  private subject = new Subject<CalculWithRestit>();
  subject$ = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  post(refinancementPretCalcul: RefinancementPretCalcul) {
    this.postApi(refinancementPretCalcul).subscribe(response => {
      // Build a CalculWithRestit Object so the restitComponent can access calcul data
      this.subject.next(new CalculWithRestit(refinancementPretCalcul, response));
    }, error => {
    });
  }

  postApi(refinancementPretCalcul: RefinancementPretCalcul): Observable<RefinancementPretRestit> {
    return this.httpClient.post<RefinancementPretRestit>(environment.apiUrl
      + '/refinancement-pret/calcul', refinancementPretCalcul, Constants.httpOptions);
  }

  export(calculWithRestit: CalculWithRestit): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/refinancement-pret/export',
      calculWithRestit, Constants.httpExportOptions);
  }
}
