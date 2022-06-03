import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BulkUploadError } from '../../models/bulk-upload-error';

export interface IDeploymentService {
  validateAndUpload(fileToUpload: File): Observable<BulkUploadError[]>;
}

@Injectable({
  providedIn: 'root'
})
export class DeploymentService implements IDeploymentService  {
  private url = '/deployments';
  constructor(private http: HttpClient) { }

  validateAndUpload(fileToUpload: File): Observable<BulkUploadError[]> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http.put<BulkUploadError[]>(this.url + '/bulk/project-mode', formData);
  }
}
