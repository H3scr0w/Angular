import { User } from './user.model';

export class OptionProfile {
  id: number;
  name: string;
  owner: User;
  isDefault: boolean;
  timeoutErrorThreshold: number;
  unexpectedErrorThreshold: number;
}
