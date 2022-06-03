import { OptionProfile } from './optionprofile.model';
import { RobotType } from './robot-type.model';
import { ScannerAppliance } from './scanner-appliance.model';
import { AuthRecordsWrapper } from './util/authrecord-wrapper.model';

export class WebApp {
  id: number;
  name: string;
  url: string;
  authRecords: AuthRecordsWrapper;
  defaultScanner: ScannerAppliance;
  defaultProfile: OptionProfile;
  useRobots: RobotType;
  useSitemap: boolean;
  createdDate: Date;
  updatedDate: Date;
}
