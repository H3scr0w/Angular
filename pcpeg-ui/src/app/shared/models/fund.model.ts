import { ContactModel } from './contact.model';
import { TenantAccountModel } from './tenant-account.model';

export class FundModel {
  fundId = 0;
  fundLabel: string;
  amundiCode?: string;
  contact?: ContactModel;
  tenantAccount?: TenantAccountModel;
  fundGroupId: string;
  isDefault = false;
  isActive = false;
}

export enum FundTypes {
  SPE = 'SPE',
  DIV = 'DIV',
  PCL = 'PCL',
  PAI = 'PAI'
}
