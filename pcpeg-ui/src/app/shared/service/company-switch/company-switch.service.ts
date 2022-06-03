import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CampaignModel } from '../../models/campaign.model';
import { CompanySettingModel } from '../../models/company-setting.model';
import { CompanySettingValidationModel } from './../../models/company-setting-validation.model';
import { PaymentTypes } from './../../models/payment-types';

@Injectable({
  providedIn: 'root'
})
export class CompanySwitchService {
  companyCampaign$: Observable<CampaignModel>;
  companyInterestSetting$: Observable<CompanySettingModel>;
  companyInterestSuppSetting$: Observable<CompanySettingModel>;
  companyParticipationSetting$: Observable<CompanySettingModel>;
  companyParticipationSuppSetting$: Observable<CompanySettingModel>;
  companyCetSetting$: Observable<CompanySettingModel>;
  companySettingValidated$: Observable<CompanySettingValidationModel>;

  private companyCampaign: BehaviorSubject<CampaignModel> = new BehaviorSubject(new CampaignModel());
  private companyInterestSetting: BehaviorSubject<CompanySettingModel> = new BehaviorSubject(new CompanySettingModel());
  private companyInterestSuppSetting: BehaviorSubject<CompanySettingModel> = new BehaviorSubject(
    new CompanySettingModel()
  );
  private companyParticipationSetting: BehaviorSubject<CompanySettingModel> = new BehaviorSubject(
    new CompanySettingModel()
  );
  private companyParticipationSuppSetting: BehaviorSubject<CompanySettingModel> = new BehaviorSubject(
    new CompanySettingModel()
  );
  private companyCetSetting: BehaviorSubject<CompanySettingModel> = new BehaviorSubject(new CompanySettingModel());
  private companySettingValidated: BehaviorSubject<CompanySettingValidationModel> = new BehaviorSubject(
    new CompanySettingValidationModel()
  );

  constructor() {
    this.companyCampaign$ = this.companyCampaign.asObservable();
    this.companyInterestSetting$ = this.companyInterestSetting.asObservable();
    this.companyInterestSuppSetting$ = this.companyInterestSuppSetting.asObservable();
    this.companyParticipationSetting$ = this.companyParticipationSetting.asObservable();
    this.companyParticipationSuppSetting$ = this.companyParticipationSuppSetting.asObservable();
    this.companyCetSetting$ = this.companyCetSetting.asObservable();
    this.companySettingValidated$ = this.companySettingValidated.asObservable();
  }

  notifyCompanyCampaign(data: CampaignModel): void {
    this.companyCampaign.next(data);
  }

  notifyCompanySetting(data: CompanySettingModel, paymentType: number): void {
    if (paymentType === PaymentTypes.INTERET) {
      this.companyInterestSetting.next(data);
    } else if (paymentType === PaymentTypes.PARTICIPATION) {
      this.companyParticipationSetting.next(data);
    } else if (paymentType === PaymentTypes.INTEREST_SUPP) {
      this.companyInterestSuppSetting.next(data);
    } else if (paymentType === PaymentTypes.PARTICIPATION_SUPP) {
      this.companyParticipationSuppSetting.next(data);
    } else if (paymentType === PaymentTypes.CET) {
      this.companyCetSetting.next(data);
    }
  }

  notifyCompanySettingValidated(data: CompanySettingValidationModel): void {
    this.companySettingValidated.next(data);
  }
}
