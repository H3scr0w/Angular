import { Injectable } from '@angular/core';
import { Application } from '../../models/application';

export interface IApplicationService {
  getAllApplications(): Application[];
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService implements IApplicationService {
  constructor() {}

  getAllApplications(): Application[] {
    const applications: Application[] = [];
    applications.push(new Application(1, 'TOM V2'));
    applications.push(new Application(2, 'SPO'));
    return applications;
  }
}
