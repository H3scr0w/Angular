import { of, Observable } from 'rxjs';
import { RequestBulkSiteError } from '../../models/request-bulk-site';
import { IRequestBulkSiteService } from './request-bulk-site.service';

export class MockRequestBulkSiteService implements IRequestBulkSiteService {
  downloadTemplate(): Observable<Blob> {
    return of(null);
  }

  validateAndUpload(fileToUpload: File): Observable<RequestBulkSiteError[]> {
    return of(null);
  }
}
