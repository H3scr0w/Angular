import { UserManual } from '@shared';
import { IUserManualService } from './user-manual.service';

export class MockUserManualService implements IUserManualService {
  getAllUserManuals(): UserManual[] {
    return null;
  }
}
