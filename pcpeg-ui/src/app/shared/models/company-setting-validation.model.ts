import { CompanySettingModel } from './company-setting.model';
import { FundModel } from './fund.model';

export class CompanySettingValidationModel extends CompanySettingModel {
  constructor(public defaultFund?: FundModel) {
    super();
  }
}
