import { DocumentModel } from './document.model';
import { FundModel } from './fund.model';
import { PaymentModel } from './payment.model';

export class CompanySettingModel {
  constructor(public payment?: PaymentModel, public documents?: DocumentModel[], public funds?: FundModel[]) {}
}
