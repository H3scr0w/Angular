import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiNotarialeService {

  constructor(private httpClient: HttpClient) {
  }

  getPersonInfo(personId: string) {
    return this.httpClient.get<Person>(
      `${environment.apiUrl}/personnes/${personId}`);
  }
}
