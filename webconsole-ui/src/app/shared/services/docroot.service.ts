import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Docroot } from '../models/docroot.model';
import { Domain } from '../models/domain.model';
import { LoadBalancer } from '../models/loadbalancer.model';
import { Server } from '../models/server.model';
import { Website } from '../models/website.model';
import { DocrootEnvironmentDetail } from './../models/docrootenvironmentdetail.model';
import { Environment } from './../models/environment.model';
import { Page } from './../models/page.model';
import { WebsiteDeployed } from './../models/website-deployed.model';

@Injectable({ providedIn: 'root' })
export class DocrootService {
  private url = '/hosting/docroots';

  constructor(private http: HttpClient) { }

  getAllDocroots(index?: number,
                 size?: number,
                 sortField?: string,
                 sortDirection?: SortDirection,
                 search?: string): Observable<Page<Docroot>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Docroot>>(this.url, { params });
  }

  getAllDocrootsByName(name: string): Observable<Page<Docroot>> {
    const params: HttpParams = new HttpParams().set('name', name);
    return this.http.get<Page<Docroot>>(this.url, { params });
  }

  getAllEnvironments(
    code: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string): Observable<Page<Environment>> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Environment>>(this.url + '/' + code + '/env', { params });
  }

  createOrUpdate(docroot: Docroot, docrootCode: string): Observable<Docroot> {
    return this.http.put<Docroot>(this.url + '/' + docrootCode, docroot);
  }

  createOrUpdateEnv(
    environmentCode: string,
    docrootCode: string,
    docrootEnvdetail: DocrootEnvironmentDetail
  ): Observable<DocrootEnvironmentDetail> {
    return this.http.put<DocrootEnvironmentDetail>(
      this.url + '/' + docrootCode + '/env/' + environmentCode,
      docrootEnvdetail
    );
  }

  deleteDocrootEnv(environmentCode: string, docrootCode: string): Observable<void> {
    return this.http.delete<void>(this.url + '/' + docrootCode + '/env/' + environmentCode);
  }

  getDocrootEnv(docrootCode: string, environmentCode: string): Observable<DocrootEnvironmentDetail> {
    return this.http.get<DocrootEnvironmentDetail>(this.url + '/' + docrootCode + '/env/' + environmentCode);
  }

  getAllServers(
    index?: number,
    size?: number,
    docrootCode?: string,
    environmentCode?: string,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Server>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<Server>>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/servers', {
      params
    });
  }

  createOrUpdateServer(environmentCode: string, docrootCode: string, hostname: string): Observable<Server> {
    return this.http.put<Server>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/servers/' + hostname, {});
  }

  deleteDocrootServer(environmentCode: string, docrootCode: string, hostname: string): Observable<void> {
    return this.http.delete<void>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/servers/' + hostname);
  }

  getAllSites(
    index?: number,
    size?: number,
    docrootCode?: string,
    environmentCode?: string
  ): Observable<Page<Website>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<Website>>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/websites', {
      params
    });
  }

  createOrUpdateSite(
    environmentCode: string,
    docrootCode: string,
    websiteCode: string,
    websiteDeployed: WebsiteDeployed
  ): Observable<WebsiteDeployed> {
    return this.http.put<WebsiteDeployed>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/websites/' + websiteCode,
      websiteDeployed
    );
  }

  deleteDocrootSite(environmentCode: string, docrootCode: string, websiteCode: string): Observable<void> {
    return this.http.delete<void>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/websites/' + websiteCode
    );
  }

  getAllDomains(
    index?: number,
    size?: number,
    docrootCode?: string,
    environmentCode?: string
  ): Observable<Page<Domain>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<Domain>>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/domains', {
      params
    });
  }

  createOrUpdateDomain(
    environmentCode: string,
    docrootCode: string,
    domainCode: string,
    domain: Domain
  ): Observable<Domain> {
    return this.http.put<Domain>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/domains/' + domainCode,
      domain
    );
  }

  deleteDocrootDomain(environmentCode: string, docrootCode: string, domainCode: string): Observable<void> {
    return this.http.delete<void>(this.url + '/' + docrootCode + '/env/' + environmentCode + '/domains/' + domainCode);
  }

  getAllLoadBalancers(
    index?: number,
    size?: number,
    docrootCode?: string,
    environmentCode?: string,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<LoadBalancer>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<LoadBalancer>>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/loadbalancers',
      {
        params
      }
    );
  }

  createOrUpdateLoadBalancer(
    environmentCode: string,
    docrootCode: string,
    loadBalancerCode: string,
    loadBalancer: LoadBalancer
  ): Observable<LoadBalancer> {
    return this.http.put<LoadBalancer>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/loadbalancers/' + loadBalancerCode,
      loadBalancer
    );
  }

  deleteDocrootLoadBalancer(environmentCode: string, docrootCode: string, loadBalancerCode: string): Observable<void> {
    return this.http.delete<void>(
      this.url + '/' + docrootCode + '/env/' + environmentCode + '/loadbalancers/' + loadBalancerCode
    );
  }

  clearAcquiaVarnish(docrootCode: string, environmentCode: string, domainCode: string): Observable<void> {
    return this.http.post<void>
    (this.url + '/' + docrootCode + '/env/' + environmentCode + '/domains/' + domainCode + '/clear-acquia-varnish', null);
  }
}
