import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailTemplateModel } from '../../models/email-template.model';

export interface IEmailTemplatesService {
  getEmailTemplateById(id: string): Observable<EmailTemplateModel>;
}
@Injectable({
  providedIn: 'root'
})
export class EmailTemplatesService implements IEmailTemplatesService {
  private url = '/email-templates';

  constructor(private http: HttpClient) {}

  getEmailTemplateById(id: string): Observable<EmailTemplateModel> {
    return this.http.get<EmailTemplateModel>(this.url + '/' + id);
  }

  updateEmailTemplate(id: string, emailTemplate: EmailTemplateModel): Observable<EmailTemplateModel> {
    return this.http.put<EmailTemplateModel>(this.url + '/' + id, emailTemplate);
  }
}
