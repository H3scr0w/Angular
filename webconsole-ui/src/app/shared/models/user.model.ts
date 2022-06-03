import { AccessRight } from './access-right.model';
export class User {
  userId: number;
  email: string;
  firstname: string;
  lastname: string;
  company: string;
  isAdmin: boolean;
  isActive: boolean;
  role: string;
  accessrightByUsers: AccessRight[];
}
