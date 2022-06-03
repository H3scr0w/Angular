import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestBulkSiteError } from '../../models/request-bulk-site';

export interface IRequestBulkSiteService {
  downloadTemplate(): Observable<Blob>;
  validateAndUpload(fileToUpload: File): Observable<RequestBulkSiteError[]>;
}

@Injectable({
  providedIn: 'root'
})
export class RequestBulkSiteService implements IRequestBulkSiteService {
  constructor(private http: HttpClient) {}

  downloadTemplate(): Observable<Blob> {
    const url = window.location.origin + '/assets/Bulk_site_creation_Template.xlsx';
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/xlsx');
    return this.http.get(url, { headers, responseType: 'blob' });
  }

  validateAndUpload(fileToUpload: File): Observable<RequestBulkSiteError[]> {
    const url = '/site-creation-requests/uploadexcel';

    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.post<RequestBulkSiteError[]>(url, formData);
  }
}
