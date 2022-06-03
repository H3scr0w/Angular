import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Domain } from '../models/domain.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
  private url = '/hosting/domains';

  constructor(private http: HttpClient) {}

  isAdmin(domainCode: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/isadmin/' + domainCode);
  }

  getAllDomains(index?: number, size?: number): Observable<Page<Domain>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<Domain>>(this.url, { params });
  }

  getAllDomainsByName(name: string): Observable<Page<Domain>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<Domain>>(this.url, { params });
  }

  getAllDomainsByNameAndQualysEnable(name: string, isQualysEnabled: boolean): Observable<Page<Domain>> {
    const params: HttpParams = new HttpParams().set('name', '' + name).set('qualysEnabled', '' + isQualysEnabled);
    return this.http.get<Page<Domain>>(this.url, { params });
  }

  getAllDomainsByNameAndWaf(name: string): Observable<Page<Domain>> {
    const params: HttpParams = new HttpParams().set('name', '' + name).set('waf', 'true');
    return this.http.get<Page<Domain>>(this.url, { params });
  }

  createOrUpdate(domainCode: string, domain: Domain): Observable<Domain> {
    return this.http.put<Domain>(this.url + '/' + domainCode, domain);
  }

  delete(domainCode: string): Observable<void> {
    return this.http.delete<void>(this.url + '/' + domainCode);
  }

  transfer(domainCode: string, websiteCode: string, docrootCode: string, environmentCode: string): Observable<Domain> {
    return this.http.post<Domain>(
      this.url +
        '/' +
        domainCode +
        '/transfer/websites/' +
        websiteCode +
        '/docroots/' +
        docrootCode +
        '/env/' +
        environmentCode,
      null
    );
  }
}
