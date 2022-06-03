import { Observable } from 'rxjs';
import { RequestCancellation } from '../../models/request-cancellation';
import { IRequestCancellationService } from './cancellation-request.service';

export class MockCancellationRequestService implements IRequestCancellationService {
  cancelRequest(requestCancellation: RequestCancellation): Observable<RequestCancellation> {
    throw new Error('Method not implemented.');
  }
}
