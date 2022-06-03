import { User } from './user.model';
import { WasScanMode } from './wascan-mode.model';
import { WasScanOptionProfile } from './wascan-optionprofile.model';
import { WasScanStatus } from './wascan-status.model';
import { WasScanTarget } from './wascan-target.model';
import { WasScanType } from './wascan-type.model';

export class WasScan {
  id: number;
  name: string;
  reference: string;
  type: WasScanType;
  mode: WasScanMode;
  status: WasScanStatus;
  target: WasScanTarget;
  profile: WasScanOptionProfile;
  cancelTime: string;
  launchedBy: User;
  launchedDate: Date;
  endScanDate: Date;
  sendMail: boolean;
}
