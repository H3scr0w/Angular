import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { Networks } from '../../models/networks.model';
import { OperatorMailTemplate } from '../../models/operator-mail-template.model';
import { Page } from '../../models/page.model';
import { IMailTemplateService } from './operator-mail-template.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}

export class MockOperatorMailTemplateService implements IMailTemplateService {
  getAllMailTemplates(
    search?: string,
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc
  ): Observable<Page<OperatorMailTemplate>> {
    return of(null);
  }

  updateMailTemplate(operatorMailTemplate: OperatorMailTemplate): Observable<OperatorMailTemplate> {
    throw new Error('Method not implemented.');
  }

  updateMailTemplates(operatorMailTemplates: OperatorMailTemplate[]): Observable<OperatorMailTemplate[]> {
    throw new Error('Method not implemented.');
  }

  getAllNetworks(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string,
    networkId?: Array<number>
  ): Observable<Page<Networks>> {
    return of(null);
  }

  getOperatorMailTemplateByNetworkAndRequestType(
    networkId: number,
    requestType: string
  ): Observable<OperatorMailTemplate> {
    throw new Error('Method not implemented.');
  }
}
