import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetadataService {

  constructor(private httpClient: HttpClient) { }

  getIndiceMetaData(type: string): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/indice/meta-data?type=' + type);
  }

  getTableMortaliteMetaData(): Observable<any> {
    return this.httpClient.get<any>(environment.apiUrl + '/tables-mortalite/meta-data');
  }

}
