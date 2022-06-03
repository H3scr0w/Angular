import { Request } from '../../../shared/models/request';
import { TelecomService } from '../../../shared/models/telecom-service-selector';

export interface IRequestDialogData {
  mode: string;
  request: Request;
  requestType: number;
  telecomService: TelecomService;
  showAction: true;
}

export class RequestResultDialogData {
  action: string;
  request: Request;
  isAnyError: boolean;
  isStatusUpdateOnSaveAndSendCSV: boolean;
}
