import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import {
  AclsConfiguration,
  IncapsulaResponse,
  ThreatsConfiguration
} from '../../../models/tools/incapsula/incapsula-data.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private url = '/tools/incapsula/sites';

  constructor(private http: HttpClient) {}

  configureSecurity(domainCode: string, conf: ThreatsConfiguration): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/configure/security', conf);
  }

  configureAcl(domainCode: string, conf: AclsConfiguration): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/configure/acl', conf);
  }

  uploadCertificate(domainCode: string, certificateCode: string): Observable<IncapsulaResponse> {
    return this.http.put<IncapsulaResponse>(this.url + '/' + domainCode + '/certificate/' + certificateCode, null);
  }

  deleteCertificate(domainCode: string): Observable<IncapsulaResponse> {
    return this.http.delete<IncapsulaResponse>(this.url + '/' + domainCode + '/certificate');
  }
}
