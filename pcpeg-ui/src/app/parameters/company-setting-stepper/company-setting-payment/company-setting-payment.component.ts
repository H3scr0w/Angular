import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CampaignModel } from 'src/app/shared/models/campaign.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DocumentDialogComponent } from '../../../shared/components/document-dialog/document-dialog.component';
import { FundSettingDialogComponent } from '../../../shared/components/fund-setting-dialog/fund-setting-dialog.component';
import { CompanySettingValidationModel } from '../../../shared/models/company-setting-validation.model';
import { DocumentFileModel } from '../../../shared/models/document-file.model';
import { DocumentFormats } from '../../../shared/models/document-types';
import { PaymentTypes } from '../../../shared/models/payment-types';
import { PaymentModel } from '../../../shared/models/payment.model';
import { CompanySwitchService } from '../../../shared/service/company-switch/company-switch.service';
import { CompanyService } from '../../../shared/service/company/company.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CompanySettingModel } from './../../../shared/models/company-setting.model';
import { DocumentModel } from './../../../shared/models/document.model';
import { FundModel, FundTypes } from './../../../shared/models/fund.model';

@Component({
  selector: 'stgo-company-setting-payment',
  templateUrl: './company-setting-payment.component.html',
  styleUrls: ['./company-setting-payment.component.scss']
})
export class CompanySettingPaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  stepper: MatStepper;

  @Input()
  campaign: CampaignModel;

  @Input()
  paymentType: number;

  @Input()
  defaultFundsSetting: FundModel[];

  interestPayment: number = PaymentTypes.INTERET;
  participationPayment: number = PaymentTypes.PARTICIPATION;
  interestSuppPayment: number = PaymentTypes.INTEREST_SUPP;
  participationSuppPayment: number = PaymentTypes.PARTICIPATION_SUPP;
  cetPayment: number = PaymentTypes.CET;

  year: number;
  previousYear: number;

  settingForm: FormGroup = new FormGroup({
    agreement: new FormControl({ value: null, disabled: false }, Validators.required),
    payment: new FormControl({ value: null, disabled: false }, Validators.required),
    paymentInfra: new FormControl({ value: null, disabled: false }, Validators.required),
    defaultFund: new FormControl({ value: null, disabled: false }, Validators.required)
  });

  previousDefaultFund: FundModel;
  isDefaultFundDifferent = false;
  companySettings: CompanySettingModel;
  companySettingsValidated: CompanySettingValidationModel = new CompanySettingValidationModel();
  newFiles: File[] = [];
  paymentSetting: PaymentModel;
  documentsSetting: DocumentModel[];
  fundsSetting: FundModel[];

  agreements: DocumentModel[] = [];
  agreementCols: string[] = ['documentName', 'startDate', 'endDate', 'documentType', 'actions'];

  funds: FundModel[] = [];
  fundCols: string[] = ['fundLabel'];

  defaultFunds: FundModel[] = [];

  isLoading = false;

  readOnly = false;

  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private companyService: CompanyService,
    private companySwitchService: CompanySwitchService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.campaign && this.campaign.id) {
      this.year = this.campaign.id.anneeId;
      this.previousYear = this.campaign.id.anneeId - 1;
      if (!this.campaign.flagEnCours) {
        this.readOnly = true;
        this.settingForm.controls.agreement.disable();
        this.settingForm.controls.payment.disable();
        this.settingForm.controls.paymentInfra.disable();
        this.settingForm.controls.defaultFund.disable();
      }
    }

    // agreements are not mandatory for additional payments
    if (this.paymentType === this.interestSuppPayment || this.paymentType === this.participationSuppPayment) {
      this.settingForm.controls.agreement.clearValidators();
      this.settingForm.updateValueAndValidity();

      let previousPaymentType = this.interestPayment;

      if (this.paymentType === this.participationSuppPayment) {
        previousPaymentType = this.participationPayment;
      }

      this.sub$.add(
        this.companySwitchService.companySettingValidated$.subscribe(
          (previousSettingValidated: CompanySettingValidationModel) => this.getPreviousDefaultFund(previousPaymentType)
        )
      );
    }

    // infra payment is only for interest
    if (this.paymentType !== this.interestPayment) {
      this.settingForm.controls.paymentInfra.clearValidators();
      this.settingForm.updateValueAndValidity();
    }

    // no payment & default fund for cet
    if (this.paymentType === this.cetPayment) {
      this.settingForm.controls.payment.clearValidators();
      this.settingForm.controls.defaultFund.clearValidators();
      this.settingForm.updateValueAndValidity();
    }

    this.onChanges();
  }

  onChanges(): void {
    if (this.paymentType === this.interestPayment || this.paymentType === this.participationPayment) {
      this.sub$.add(
        this.settingForm.get('agreement')!.valueChanges.subscribe((val) => {
          if (val === 'false') {
            this.disablePaymentValidation();
            this.disableFundValidation();
          } else if (val === 'true') {
            this.enablePaymentValidation();
            this.enableFundValidation();
          }

          this.settingForm.updateValueAndValidity();
        })
      );
    }

    if (this.paymentType !== this.cetPayment || this.paymentType !== this.interestPayment) {
      this.sub$.add(
        this.settingForm.get('payment')!.valueChanges.subscribe((val) => {
          if (val === 'false') {
            this.disableFundValidation();
          } else if (val === 'true') {
            this.enableFundValidation();
          }
          this.settingForm.updateValueAndValidity();
        })
      );
    }

    if (this.paymentType === this.interestPayment) {
      this.sub$.add(
        this.settingForm.get('payment')!.valueChanges.subscribe((val) => {
          if (val === 'false' && this.settingForm.controls.paymentInfra.value === 'false') {
            this.disableFundValidation();
          } else if (val === 'true') {
            this.enableFundValidation();
          }
          this.settingForm.updateValueAndValidity();
        })
      );

      this.sub$.add(
        this.settingForm.get('paymentInfra')!.valueChanges.subscribe((val) => {
          if (val === 'false' && this.settingForm.controls.payment.value === 'false') {
            this.disableFundValidation();
          } else if (val === 'true') {
            this.enableFundValidation();
          }
          this.settingForm.updateValueAndValidity();
        })
      );
    }

    if (this.paymentType === this.cetPayment) {
      this.sub$.add(
        this.settingForm.get('agreement')!.valueChanges.subscribe((val) => {
          if (val === 'false') {
            this.settingForm.setErrors(null);
          } else if (val === 'true') {
            if (!this.agreements || this.agreements.length <= 0) {
              this.settingForm.controls.agreement.setErrors({ required: true });
            } else {
              this.settingForm.controls.agreement.setErrors(null);
            }
          }
          this.settingForm.updateValueAndValidity();
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
    this.settingForm.reset();
    this.buildFormData(this.companySettings);
  }

  ngAfterViewInit(): void {
    if (this.paymentType === this.interestPayment) {
      this.sub$.add(
        this.companySwitchService.companyInterestSetting$.subscribe((data: CompanySettingModel) => {
          this.buildFormData(data);
        })
      );
    } else if (this.paymentType === this.participationPayment) {
      this.sub$.add(
        this.companySwitchService.companyParticipationSetting$.subscribe((data: CompanySettingModel) => {
          this.buildFormData(data);
        })
      );
    } else if (this.paymentType === this.interestSuppPayment) {
      this.sub$.add(
        this.companySwitchService.companyInterestSuppSetting$.subscribe((data: CompanySettingModel) => {
          this.buildFormData(data);
        })
      );
    } else if (this.paymentType === this.participationSuppPayment) {
      this.sub$.add(
        this.companySwitchService.companyParticipationSuppSetting$.subscribe((data: CompanySettingModel) => {
          this.buildFormData(data);
        })
      );
    } else if (this.paymentType === this.cetPayment) {
      this.sub$.add(
        this.companySwitchService.companyCetSetting$.subscribe((data: CompanySettingModel) => {
          this.buildFormData(data);
        })
      );
    }
  }

  reset(): void {
    this.settingForm.reset();
    this.buildFormData(this.companySettings, true);
  }

  back(): void {
    this.stepper.previous();
  }

  next(): void {
    // ask user to confirm actiosn if new settings or changed
    if ((this.paymentSetting && this.paymentSetting.year !== this.year) || this.settingForm.dirty) {
      this.isLoading = true;
      const formData = new FormData();

      this.validateSettings();

      this.newFiles.forEach((file) => {
        formData.append('file', file);
      });

      formData.append(
        'companySettingValidationDTO',
        new Blob([JSON.stringify(this.companySettingsValidated)], { type: 'application/json' })
      );

      if (this.campaign.id) {
        this.sub$.add(
          this.companyService
            .validateCompanySettingsByIdAndPaymentType(this.campaign.id.societeSid, this.paymentType, formData)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe((savedCompanySetting: CompanySettingModel) => {
              this.messageService.show(
                this.translateService.instant('company.setting.confirmation.success'),
                'success'
              );

              // notify default fund to additional payment steps
              if (this.paymentType === this.interestPayment || this.paymentType === this.participationPayment) {
                this.companySwitchService.notifyCompanySettingValidated(this.companySettingsValidated);
              }

              this.buildFormData(savedCompanySetting);
            })
        );
      }
    } else {
      // if no changes for current settings go next setting
      this.nextStep();
    }
  }

  deleteFile(currentFile: DocumentModel): void {
    if (this.agreements && this.agreements.length === 1) {
      this.messageService.show(this.translateService.instant('company.setting.document.delete.info'), 'info');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: { message: this.translateService.instant('company.setting.document.delete') }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.agreements) {
        this.agreements = this.agreements.filter(
          (file: DocumentModel) => file.documentName !== currentFile.documentName
        );
        this.newFiles = this.newFiles.filter((file: File) => file.name !== currentFile.documentName);
        this.settingForm.markAsDirty();
        this.cdRef.detectChanges();
      }
    });
  }

  addFile(): void {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: '600px',
      disableClose: true,
      hasBackdrop: false,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe((result: DocumentFileModel) => {
      if (result) {
        if (
          this.agreements &&
          !this.agreements.find(
            (agreement) =>
              agreement.documentName.toLocaleUpperCase() === result.document.documentName.toLocaleUpperCase()
          )
        ) {
          this.agreements = this.agreements.concat(result.document);
          this.newFiles.push(result.file);
        } else if (!this.agreements) {
          this.agreements = [result.document];
          this.newFiles.push(result.file);
        }

        if (this.agreements) {
          this.settingForm.markAsDirty();
          if (this.settingForm.controls.agreement.invalid) {
            this.settingForm.controls.agreement.setErrors(null);
          }
          this.cdRef.detectChanges();
        }
      }
    });
  }

  deleteFund(fundToDelete: FundModel): void {
    // only specific fund can be deleted
    if (fundToDelete && fundToDelete.fundGroupId && fundToDelete.fundGroupId.includes(FundTypes.SPE)) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: { message: this.translateService.instant('fund.delete.confirmation.message') }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.funds) {
          this.funds = this.funds.filter((fund) => fund.fundId !== fundToDelete.fundId);
          this.settingForm.markAsDirty();
          this.cdRef.detectChanges();
        }
      });
    }
  }

  addFund(): void {
    const dialogRef = this.dialog.open(FundSettingDialogComponent, {
      width: '600px',
      disableClose: true,
      hasBackdrop: false,
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe((result: FundModel) => {
      if (result) {
        if (
          this.funds &&
          !this.funds.find(
            (fund) =>
              fund.fundLabel!.toLocaleUpperCase() === result.fundLabel!.toLocaleUpperCase() &&
              fund.tenantAccount!.teneurCompteId === result.tenantAccount!.teneurCompteId &&
              fund.amundiCode!.toLocaleUpperCase() === result.amundiCode!.toLocaleUpperCase()
          )
        ) {
          this.funds = this.funds.concat(result);
        } else if (!this.funds) {
          this.funds = [result];
        }

        if (this.funds) {
          this.sortFunds();
          this.settingForm.markAsDirty();
          this.cdRef.detectChanges();
        }
      }
    });
  }

  downloadFile(document: DocumentModel): void {
    if (document && document.documentName && this.campaign.id) {
      this.isLoading = true;
      this.sub$.add(
        this.companyService
          .downloadDocument(this.campaign.id.societeSid, document.documentId)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(
            (data: Blob) => {
              if (data) {
                const fileName = document.documentName.toUpperCase().endsWith(DocumentFormats.PDF)
                  ? document.documentName
                  : document.documentName + DocumentFormats.PDF;
                const blob = new Blob([data], { type: 'application/octet-stream' });
                saveAs(blob, fileName);
              }
            },
            (e: HttpErrorResponse) => {
              this.messageService.show(document.documentName + ' not found', 'error');
            }
          )
      );
    }
  }

  onSelectDefaultFund(): void {
    // check if payment & additional payment have same default fund
    if (this.paymentType === this.interestSuppPayment || this.paymentType === this.participationSuppPayment) {
      const selectedFund: FundModel = this.settingForm.controls.defaultFund.value;
      this.isDefaultFundDifferent = selectedFund && !this.previousDefaultFund;
      if (selectedFund && this.previousDefaultFund) {
        this.isDefaultFundDifferent = selectedFund.fundId !== this.previousDefaultFund.fundId;
      }
    }
  }

  private buildFormData(setting: CompanySettingModel, reset?: boolean): void {
    if (setting) {
      this.companySettings = setting;
      if (setting.payment) {
        this.paymentSetting = setting.payment;
      }
      this.documentsSetting = setting.documents ? setting.documents : [];
      this.fundsSetting = setting.funds ? setting.funds : [];

      if (this.paymentSetting && this.paymentSetting.year === this.year) {
        // settings already validated for current campaign
        this.buildValidatedSettings();
        if (!reset) {
          this.nextStep();
        }
      } else {
        // settings not validated but taken from previous campaign
        this.buildNewSettings();
      }
    }
    this.settingForm.updateValueAndValidity();
    this.cdRef.detectChanges();
  }

  private buildValidatedSettings(): void {
    /* Settings with documents */
    if (
      this.paymentType === this.interestPayment ||
      this.paymentType === this.participationPayment ||
      this.paymentType === this.cetPayment
    ) {
      // answer agreement question
      this.agreements = this.documentsSetting && this.documentsSetting.length > 0 ? this.documentsSetting : [];
      if (this.agreements.length > 0) {
        this.settingForm.patchValue({ agreement: 'true' });
      } else {
        this.settingForm.patchValue({ agreement: 'false' });
      }
    }

    // Settings with payment
    if (this.paymentType !== this.cetPayment) {
      this.settingForm.patchValue({ payment: '' + this.paymentSetting.flagVersement });

      // Interest with infra payment
      if (this.paymentType === this.interestPayment) {
        this.settingForm.patchValue({ paymentInfra: '' + this.paymentSetting.flagVersementInfra });
      }
    }

    this.buildFundsSettings();
    this.settingForm.patchValue({ defaultFund: this.fundsSetting.find((fund: FundModel) => fund.isDefault) });
  }

  private buildNewSettings(): void {
    this.settingForm.reset();
    /* Settings with documents */
    if (
      this.paymentType === this.interestPayment ||
      this.paymentType === this.participationPayment ||
      this.paymentType === this.cetPayment
    ) {
      // set agreements
      this.agreements = this.documentsSetting;
    }

    this.buildFundsSettings();
  }

  private buildFundsSettings(): void {
    /* Setting with fund */
    // get default setting as old app only took default one or three for CET
    // and not getting all from previous campaign

    if (this.paymentType === this.cetPayment && this.defaultFundsSetting) {
      this.defaultFundsSetting = this.defaultFundsSetting.filter(
        (fund: FundModel) =>
          fund.fundGroupId && (fund.fundGroupId.includes(FundTypes.PCL) || fund.fundGroupId.includes(FundTypes.SPE))
      );
    }

    if (
      !this.fundsSetting ||
      (this.fundsSetting && this.defaultFundsSetting && this.fundsSetting.length < this.defaultFundsSetting.length)
    ) {
      this.fundsSetting = this.defaultFundsSetting;
    }

    this.funds = this.fundsSetting;
    if (this.funds && this.funds.length > 0) {
      if (this.paymentType !== this.cetPayment) {
        /* Only DIV & PCL funds can be default */
        this.defaultFunds = this.funds.filter(
          (fund: FundModel) =>
            fund.fundGroupId && (fund.fundGroupId.includes(FundTypes.DIV) || fund.fundGroupId.includes(FundTypes.PCL))
        );
      } else {
        /* Only PCL funds for CET can be default*/
        this.defaultFunds = this.funds.filter(
          (fund: FundModel) => fund.fundGroupId && fund.fundGroupId.includes(FundTypes.PCL)
        );
      }
      this.sortFunds();
    }
  }

  private enableFundValidation(): void {
    if (!this.settingForm.controls.defaultFund.value) {
      this.settingForm.controls.defaultFund.reset();
      this.settingForm.controls.defaultFund.setErrors({ required: true });
    }
    this.settingForm.controls.defaultFund.setValidators(Validators.required);
  }

  private disableFundValidation(): void {
    this.settingForm.controls.defaultFund.setErrors(null);
    this.settingForm.controls.defaultFund.clearValidators();
  }

  private enablePaymentValidation(): void {
    if (!this.settingForm.controls.payment.value) {
      this.settingForm.controls.payment.reset();
      this.settingForm.controls.payment.setErrors({ required: true });
    }

    this.settingForm.controls.payment.setValidators(Validators.required);

    if (this.paymentType === this.interestPayment) {
      if (!this.settingForm.controls.paymentInfra.value) {
        this.settingForm.controls.paymentInfra.reset();
        this.settingForm.controls.paymentInfra.setErrors({ required: true });
      }

      this.settingForm.controls.paymentInfra.setValidators(Validators.required);
    }
  }

  private disablePaymentValidation(): void {
    this.settingForm.controls.payment.setErrors(null);
    this.settingForm.controls.payment.clearValidators();

    if (this.paymentType === this.interestPayment) {
      this.settingForm.controls.paymentInfra.setErrors(null);
      this.settingForm.controls.paymentInfra.clearValidators();
    }
  }

  private nextStep(): void {
    if (this.stepper.selected) {
      setTimeout(() => {
        this.settingForm.markAsPristine();
        this.stepper.selected.editable = true;
        this.stepper.selected.completed = true;
        this.stepper.next();
        this.cdRef.detectChanges();
      }, 1000);
    }
  }

  private validateSettings(): void {
    if (
      this.paymentType === this.interestPayment ||
      this.paymentType === this.participationPayment ||
      this.paymentType === this.cetPayment
    ) {
      if (this.settingForm.controls.agreement.value === 'false') {
        this.newFiles = [];
        return;
      }

      if (this.settingForm.controls.agreement.value === 'true') {
        // Documents
        this.companySettingsValidated.documents = this.agreements;
      }
    }

    if (this.paymentType !== this.cetPayment) {
      if (this.settingForm.controls.payment.value === 'false') {
        return;
      }

      if (this.settingForm.controls.payment.value === 'true') {
        // Payment
        this.companySettingsValidated.payment = new PaymentModel();
        if (this.campaign.id) {
          this.companySettingsValidated.payment.companyId = this.campaign.id.societeSid;
        }
        this.companySettingsValidated.payment.paymentType = this.paymentType;
        this.companySettingsValidated.payment.year = this.year;
        this.companySettingsValidated.payment.flagVersement = this.settingForm.controls.payment.value;
        this.companySettingsValidated.payment.flagVersementBlocPlie = false;

        if (this.paymentType === this.interestPayment) {
          this.companySettingsValidated.payment.flagVersementInfra = this.settingForm.controls.paymentInfra.value;
        }
        // Default Fund
        this.companySettingsValidated.defaultFund = this.settingForm.controls.defaultFund.value;
      }
    } else {
      // Payment
      this.companySettingsValidated.payment = new PaymentModel();
      if (this.campaign.id) {
        this.companySettingsValidated.payment.companyId = this.campaign.id.societeSid;
      }
      this.companySettingsValidated.payment.paymentType = this.paymentType;
      this.companySettingsValidated.payment.year = this.year;
      this.companySettingsValidated.payment.flagVersement =
        this.settingForm.controls.agreement.value === 'true' && this.agreements && this.agreements.length > 0
          ? true
          : false;
      this.companySettingsValidated.payment.flagVersementBlocPlie = false;
    }

    this.companySettingsValidated.funds = this.funds;
  }

  private getPreviousDefaultFund(paymentType: number): void {
    if (!this.campaign || !this.campaign.id) {
      this.router.navigate(['parameters']);
      return;
    }

    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .getCompanySettingsByIdAndPaymentType(this.campaign.id.societeSid, paymentType)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe((setting: CompanySettingModel) => {
          if (setting && setting.funds) {
            const f = setting.funds.find((fund: FundModel) => fund.isDefault);
            if (f) {
              this.previousDefaultFund = f;
            }
            this.settingForm.controls.defaultFund.patchValue(this.previousDefaultFund);
          }
        })
    );
  }

  private sortFunds(): void {
    if (this.funds) {
      const pclFunds: FundModel[] = this.funds
        .filter((fund: FundModel) => fund.fundGroupId.includes(FundTypes.PCL))
        .sort((a, b) => a.fundLabel.localeCompare(b.fundLabel));
      const divFunds: FundModel[] = this.funds
        .filter((fund: FundModel) => fund.fundGroupId.includes(FundTypes.DIV))
        .sort((a, b) => a.fundLabel.localeCompare(b.fundLabel));
      const speFunds: FundModel[] = this.funds
        .filter((fund: FundModel) => fund.fundGroupId.includes(FundTypes.SPE))
        .sort((a, b) => a.fundLabel.localeCompare(b.fundLabel));
      const otherFunds: FundModel[] = this.funds
        .filter(
          (fund: FundModel) =>
            !fund.fundGroupId.includes(FundTypes.PCL) &&
            !fund.fundGroupId.includes(FundTypes.DIV) &&
            !fund.fundGroupId.includes(FundTypes.SPE)
        )
        .sort((a, b) => a.fundLabel.localeCompare(b.fundLabel));

      this.funds = pclFunds;
      this.funds = this.funds.concat(divFunds);
      this.funds = this.funds.concat(otherFunds);
      this.funds = this.funds.concat(speFunds);

      this.defaultFunds = this.defaultFunds.sort((a, b) => a.fundLabel.localeCompare(b.fundLabel));
    }
  }
}
