import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../../models/page.model';
import { Report } from '../../../models/tools/qualys/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url = '/tools/qualys/reports';

  constructor(private http: HttpClient) {}

  getReports(index?: number, size?: number): Observable<Page<Report>> {
    index = index ? index : 0;
    size = size ? size : 10;
    const params: HttpParams = new HttpParams().set('page', '' + index).set('size', '' + size);
    return this.http.get<Page<Report>>(this.url, { params });
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(this.url, report);
  }

  downloadReport(reportId: number): Observable<Blob> {
    return this.http.post<Blob>(this.url + '/download/' + reportId, null, { responseType: 'blob' as 'json' });
  }

  deleteReport(reportId: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + reportId);
  }
}
