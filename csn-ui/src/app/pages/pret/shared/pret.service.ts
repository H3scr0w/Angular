import {Injectable} from '@angular/core';
import {PretCalcul} from './pret-calcul.model';
import {Observable, Subject} from 'rxjs';
import {PretRestit} from './pret-restit.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../../../shared/constants';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Injectable({
  providedIn: 'root',
})
export class PretService {

  private subject = new Subject<CalculWithRestit>();
  subject$ = this.subject.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  post(pretCalcul: PretCalcul) {
    this.postApi(pretCalcul).subscribe(response => {
      // Build a CalculWithRestit Object so the restitComponent can access calcul data
      this.subject.next(new CalculWithRestit(pretCalcul, response));
    }, error => {
    });
  }

  postApi(pretCalcul: PretCalcul): Observable<PretRestit> {
    return this.httpClient.post<PretRestit>(environment.apiUrl
      + '/pret/calcul', pretCalcul, Constants.httpOptions);
  }

  export(calculWithRestit: CalculWithRestit): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + '/pret/export',
      calculWithRestit, Constants.httpExportOptions);
  }
}
