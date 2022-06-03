/*import { CommandsDTO } from '../../shared/models/commands';*/
import { SaveAction } from '../../../shared/enums/enum';
import { CommandsDTO } from '../../../shared/models/commands';
import { TelecomService } from '../../../shared/models/telecom-service-selector';

export interface IOrderDialogData {
  mode: string;
  order: CommandsDTO;
  requestType: number;
  telecomService: TelecomService;
}

export class IOrderResultData {
  action: SaveAction;
  orderId: string;
  isStatusUpdateOnSaveAndSendCSV: boolean;
  isAnyError: boolean;
}
