import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {
  CacheMode,
  CacheRules,
  CacheSettings,
  IncapsulaResponse
} from '../../../models/tools/incapsula/incapsula-data.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private url = '/tools/incapsula/sites';

  constructor(private http: HttpClient) {}

  purgeCache(domainCode: string): Observable<IncapsulaResponse> {
    return this.http.delete<IncapsulaResponse>(this.url + '/' + domainCode + '/cache/purge');
  }

  configureCacheMode(domainCode: string, cacheMode: CacheMode): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/cache/mode', cacheMode);
  }

  configureCacheRules(domainCode: string, cacheRules: CacheRules): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/cache/rules', cacheRules);
  }

  configureCacheSettings(domainCode: string, cacheSettings: CacheSettings): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/cache/settings', cacheSettings);
  }
}
