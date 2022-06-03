import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { FundModel, FundTypes } from '../../models/fund.model';
import { Page } from '../../models/page.model';
import { FundService } from '../../service/fund/fund.service';

@Component({
  selector: 'stgo-fund-setting-dialog',
  templateUrl: './fund-setting-dialog.component.html',
  styleUrls: ['./fund-setting-dialog.component.css']
})
export class FundSettingDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  fundForm: FormGroup;

  funds: FundModel[];
  inputFund: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  constructor(public dialogRef: MatDialogRef<FundSettingDialogComponent>, private fundService: FundService) {}

  ngOnInit(): void {
    this.fundForm = new FormGroup({
      fund: new FormControl(null, Validators.required)
    });

    this.sub$.add(
      this.inputFund.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        this.getAllSpecificFunds(value);
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
    this.dialogRef.close(this.fundForm.controls.fund.value);
  }

  getAllSpecificFunds(value: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.fundService
        .getAllFunds(0, 50, 'fondsLibelle', 'asc', value, [FundTypes.SPE], true)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<FundModel>) => {
          if (page) {
            this.funds = page.content.sort((a, b) => a.fundLabel!.localeCompare(b.fundLabel!));
          }
        })
    );
  }
}
