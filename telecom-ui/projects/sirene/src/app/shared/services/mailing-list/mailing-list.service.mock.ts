import { MailingList, Page } from '@shared';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IMailingListService } from './mailing-list.service';

enum Sort {
  Asc = 'asc',
  Desc = 'desc'
}
export class MockMailingListService implements IMailingListService {
  getAllMailingList(
    index?: number,
    size?: number,
    sortField?: string,
    sortDirection?: '' | Sort.Asc | Sort.Desc,
    search?: string
  ): Observable<Page<MailingList>> {
    return of();
  }

  updateMailingList(mailingList: MailingList): Observable<MailingList> {
    return of();
  }

  saveMailingList(mailingList: MailingList): Observable<MailingList> {
    return of();
  }
}
