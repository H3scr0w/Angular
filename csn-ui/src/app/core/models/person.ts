import { ApiNotarialeGender } from '../../shared/enums';

export interface Person {
  ctmPrenom: string;
  ctmNomUsuel: string;
  ctmSexe: ApiNotarialeGender;
  jpegPhoto: string;
  uid: string;
  isAdmin: boolean;
  officeName: string;
}
