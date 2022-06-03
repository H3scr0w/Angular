import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';
import { Page } from '../models/page.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private url = '/hosting/certificates';

  constructor(private http: HttpClient) {}

  getAllCertificates(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string
  ): Observable<Page<Certificate>> {

    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }
    return this.http.get<Page<Certificate>>(this.url, { params });
  }

  getAllCertificatesByName(name: string): Observable<Page<Certificate>> {
    const params: HttpParams = new HttpParams().set('name', '' + name);
    return this.http.get<Page<Certificate>>(this.url, { params });
  }

  createOrUpdate(
    certificateCode: string,
    certificate: Certificate,
    certFile?: File,
    keyFile?: File
  ): Observable<Certificate> {
    const formData: FormData = new FormData();

    formData.append('certParam', new Blob([JSON.stringify(certificate)]));

    if (certFile) {
      formData.append('certFile', certFile);
    }

    if (keyFile) {
      formData.append('keyFile', keyFile);
    }

    return this.http.post<Certificate>(this.url + '/' + certificateCode, formData);
  }

  deleteCertificate(certificateCode: string): Observable<void> {
    return this.http.delete<void>(this.url + '/' + certificateCode);
  }
}
