import { of, Observable } from 'rxjs';
import { BulkUploadError } from '../../models/bulk-upload-error';
import { IDeploymentService } from './deployment.service';

export class MockDeploymentService implements IDeploymentService {
  validateAndUpload(fileToUpload: File): Observable<BulkUploadError[]> {
    return of(null);
  }
}
