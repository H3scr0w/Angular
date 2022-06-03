import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CampaignModel } from '../../shared/models/campaign.model';
import { CompanySettingModel } from '../../shared/models/company-setting.model';
import { FundModel, FundTypes } from '../../shared/models/fund.model';
import { Page } from '../../shared/models/page.model';
import { PaymentTypes } from '../../shared/models/payment-types';
import { CompanySwitchService } from '../../shared/service/company-switch/company-switch.service';
import { CompanyService } from '../../shared/service/company/company.service';
import { FundService } from '../../shared/service/fund/fund.service';

@Component({
  selector: 'stgo-company-setting-stepper',
  templateUrl: './company-setting-stepper.component.html',
  styleUrls: ['./company-setting-stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CompanySettingStepperComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(MatStepper, { static: true })
  stepper: MatStepper;

  campaignModel: CampaignModel;
  fundsSetting: FundModel[];
  interestPayment: number = PaymentTypes.INTERET;
  participationPayment: number = PaymentTypes.PARTICIPATION;
  interestSuppPayment: number = PaymentTypes.INTEREST_SUPP;
  participationSuppPayment: number = PaymentTypes.PARTICIPATION_SUPP;
  cetPayment: number = PaymentTypes.CET;

  interestFormGroup: FormGroup;
  participationFormGroup: FormGroup;
  interestSuppFormGroup: FormGroup;
  participationSuppFormGroup: FormGroup;
  cetFormGroup: FormGroup;

  isInterestLoading = false;
  isParticipationLoading = false;
  isInterestSuppLoading = false;
  isParticipationSuppLoading = false;
  isCetLoading = false;
  isFundLoading = false;

  interestSettingValided = false;
  participationSettingValided = false;
  interestSuppSettingValided = false;
  participationSuppSettingValided = false;
  cetSettingValided = false;

  interestSetting: CompanySettingModel;
  participationSetting: CompanySettingModel;
  interestSuppSetting: CompanySettingModel;
  participationSuppSetting: CompanySettingModel;
  cetSetting: CompanySettingModel;

  year: number;

  private sub$: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private companySwitchService: CompanySwitchService,
    private companyService: CompanyService,
    private fundService: FundService,
    private router: Router
  ) {
    const date = new Date();
    this.year = date.getUTCFullYear();

    this.getFundsSetting();

    this.sub$.add(
      this.companySwitchService.companyCampaign$.subscribe((data: CampaignModel) => {
        this.campaignModel = data;
        this.getAllCompanySettings();
      })
    );
  }

  ngOnInit(): void {
    if (!this.campaignModel) {
      this.router.navigate(['parameters']);
    }
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdRef.detectChanges();
  }

  back(): void {
    this.companySwitchService.notifyCompanyCampaign(null!);
    this.companySwitchService.notifyCompanySetting(null!, this.interestPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.participationPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.interestSuppPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.participationSuppPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.cetPayment);
    this.router.navigate(['parameters']);
  }

  private getAllCompanySettings(): void {
    if (this.campaignModel && this.campaignModel.id) {
      this.getCompanySettings(this.interestPayment);
      this.getCompanySettings(this.participationPayment);
      this.getCompanySettings(this.interestSuppPayment);
      this.getCompanySettings(this.participationSuppPayment);
      this.getCompanySettings(this.cetPayment);
    }
  }

  private getCompanySettings(paymentType: number): void {
    this.isLoadingSetting(paymentType);
    if (!this.campaignModel || !this.campaignModel.id) {
      return;
    }
    this.sub$.add(
      this.companyService
        .getCompanySettingsByIdAndPaymentType(this.campaignModel.id.societeSid, paymentType)
        .pipe(
          finalize(() => {
            this.stopLoadingSetting(paymentType);
          })
        )
        .subscribe((setting: CompanySettingModel) => {
          this.companySwitchService.notifyCompanySetting(setting, paymentType);
        })
    );
  }

  private isLoadingSetting(paymentType: number): void {
    if (paymentType === this.interestPayment) {
      this.isInterestLoading = true;
    } else if (paymentType === this.participationPayment) {
      this.isParticipationLoading = true;
    } else if (paymentType === this.interestSuppPayment) {
      this.isInterestSuppLoading = true;
    } else if (paymentType === this.participationSuppPayment) {
      this.isParticipationSuppLoading = true;
    } else if (paymentType === this.cetPayment) {
      this.isCetLoading = true;
    }
  }

  private stopLoadingSetting(paymentType: number): void {
    if (paymentType === this.interestPayment) {
      this.isInterestLoading = false;
    } else if (paymentType === this.participationPayment) {
      this.isParticipationLoading = false;
    } else if (paymentType === this.interestSuppPayment) {
      this.isInterestSuppLoading = false;
    } else if (paymentType === this.participationSuppPayment) {
      this.isParticipationSuppLoading = false;
    } else if (paymentType === this.cetPayment) {
      this.isCetLoading = false;
    }
  }

  private getFundsSetting(): void {
    this.isFundLoading = true;
    this.sub$.add(
      this.fundService
        .getAllFunds(0, 100, 'fondsLibelle', 'asc', '', [FundTypes.DIV, FundTypes.PCL])
        .pipe(finalize(() => (this.isFundLoading = false)))
        .subscribe((page: Page<FundModel>) => {
          if (page) {
            this.fundsSetting = page.content.sort((a, b) => a.fundLabel!.localeCompare(b.fundLabel!));
          }
        })
    );
  }
}
