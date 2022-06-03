import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IncapsulaResponse, Site, StatusTests } from '../../../models/tools/incapsula/incapsula-data.model';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private url = '/tools/incapsula/sites';

  constructor(private http: HttpClient) {}

  getSiteStatus(domainCode: string, site?: Site): Observable<IncapsulaResponse> {
    if (!site) {
      // @ts-ignore
      const statusTests: StatusTests[] = Object.keys(StatusTests).map((st) => StatusTests[st]);
      // @ts-ignore
      site = { ...site, tests: statusTests };
    }

    return this.http.post<IncapsulaResponse>(this.url + '/status/' + domainCode, site);
  }

  addSite(site: Site): Observable<IncapsulaResponse> {
    return this.http.post<IncapsulaResponse>(this.url + '/', site);
  }

  configureSite(domainCode: string, site: Site): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/configure/site', site);
  }
}
