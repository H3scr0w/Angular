import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Command } from '../models/command.model';
import { Page } from '../models/page.model';
import { Deployment } from './../models/deployment.model';

@Injectable({ providedIn: 'root' })
export class DeploymentService {
  private url = '/deployment';

  constructor(private http: HttpClient) {}

  getDeployments(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: SortDirection,
    status?: string,
    search?: string
  ): Observable<Page<Deployment>> {
    index = index ? index : 0;
    size = size ? size : 10;
    let params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);

    if (sortField && sortDirection) {
      params = params.set('sort', `${sortField},${sortDirection}`);
    }

    if (status) {
      params = params.set('status', `${status}`);
    }

    if (search) {
      params = params.set('search', `${search}`);
    }

    return this.http.get<Page<Deployment>>(this.url, { params });
  }

  deploy(deploymentId: number): Observable<Deployment> {
    return this.http.post<Deployment>(this.url + '/' + deploymentId + '/deploy', {});
  }

  cancel(deploymentId: number): Observable<Deployment> {
    return this.http.post<Deployment>(this.url + '/' + deploymentId + '/cancel', {});
  }

  /* tslint:disable-next-line */
  getLogs(
    deploymentId: number
  ): Observable<{
    entries: {
      time: string;
      absolute_time: string;
      log: string;
      level: string;
      user: string;
      stepctx: string;
      node: string;
    }[];
  }> {
    /* tslint:disable-next-line */
    return this.http.get<{
      entries: {
        time: string;
        absolute_time: string;
        log: string;
        level: string;
        user: string;
        stepctx: string;
        node: string;
      }[];
    }>(this.url + '/' + deploymentId + '/logs');
  }

  getCommands(deploymentId: number): Observable<Command[]> {
    return this.http.get<Command[]>(this.url + '/' + deploymentId + '/commands');
  }

  editComands(commands: Command[], deploymentId: number): Observable<Command[]> {
    return this.http.put<Command[]>(this.url + '/' + deploymentId + '/commands', commands);
  }
}
