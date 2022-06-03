import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { Page } from '../../models/page.model';
import { CompanyService } from '../../service/company/company.service';
import { TenantAccountService } from '../../service/tenant-account/tenant-account.service';
import { FundModel, FundTypes } from './../../models/fund.model';
import { TenantAccountModel } from './../../models/tenant-account.model';
import { IFundDialogData } from './fund-dialog-data';

@Component({
  selector: 'stgo-fund-dialog',
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.css']
})
export class FundDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  fundForm: FormGroup;

  tenantAccounts: TenantAccountModel[];
  inputTenantAccount: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<FundDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFundDialogData,
    private companyService: CompanyService,
    private tenantAccountService: TenantAccountService
  ) {
    this.fundForm = new FormGroup({
      fundLabel: new FormControl(null, Validators.required),
      amundiCode: new FormControl(null, Validators.required),
      contactName: new FormControl(null),
      contactTel: new FormControl(null),
      contactMail: new FormControl(null),
      tenantAccount: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    if (!this.data) {
      this.onNoClick();
    }

    this.sub$.add(
      this.inputTenantAccount.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        this.getAllTenantAccounts(value);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    const fund: FundModel = new FundModel();
    fund.amundiCode = this.fundForm.controls.amundiCode.value;
    fund.fundGroupId = FundTypes.SPE.toUpperCase();
    fund.fundLabel = this.fundForm.controls.fundLabel.value;
    fund.tenantAccount = this.fundForm.controls.tenantAccount.value;
    const contactName = this.fundForm.controls.contactName.value;
    const contactMail = this.fundForm.controls.contactMail.value;
    if (contactName || contactMail) {
      fund.contact = {
        email: contactMail,
        name: contactName,
        phone: this.fundForm.controls.contactTel.value
      };
    }

    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .createOrUpdateFund(this.data.societeSid, this.data.paymentTypeId, fund)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((result: FundModel) => this.dialogRef.close(result))
    );
  }

  private getAllTenantAccounts(value: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.tenantAccountService
        .getAllTenantAccounts(0, 50, 'teneurCompteLibelle', 'asc', value)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<TenantAccountModel>) => {
          if (page) {
            this.tenantAccounts = page.content.sort((a, b) =>
              a.teneurCompteLibelle.localeCompare(b.teneurCompteLibelle)
            );
          }
        })
    );
  }
}
