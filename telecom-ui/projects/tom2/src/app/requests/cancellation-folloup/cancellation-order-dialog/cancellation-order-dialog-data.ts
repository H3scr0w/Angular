import { RequestCancellationDTO } from '../../../shared/models/request-cancellation';

export interface CancellationOrderDialogData {
  mode: string;
  requestCancellation: RequestCancellationDTO;
}
