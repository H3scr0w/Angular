import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CsvParameter } from '../../../shared/models/csv-parameter';
import { Operator } from '../../../shared/models/operators';
import { CsvParameterService } from '../../../shared/service/csvparameter/csv-parameter.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { OperatorValidator } from './operator-validator';
import { OperatorDialogData } from './operators-dialog-data';

@Component({
  selector: 'stgo-operator-dialog',
  templateUrl: './operator-dialog.component.html',
  styleUrls: ['./operator-dialog.component.css']
})
export class OperatorDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  private sub$: Subscription = new Subscription();

  operatorForm = this.fb.group({
    id: [''],
    name: ['', { validators: [Validators.required] }]
  });

  constructor(
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private translateService: TranslateService,
    private csvParameterService: CsvParameterService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperatorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OperatorDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.operatorForm.setValue({
        id: !this.data.operator.id ? 0 : this.data.operator.id,
        name: this.data.operator.name
      });
      this.operatorForm
        .get('name')
        .setAsyncValidators([
          OperatorValidator.validateOperatorNameNotTaken(
            this.operatorsService,
            this.operatorForm,
            this.operatorForm.get('name').value
          )
        ]);
    } else {
      this.operatorForm
        .get('name')
        .setAsyncValidators([
          OperatorValidator.validateOperatorNameNotTaken(this.operatorsService, this.operatorForm, null)
        ]);
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.operatorForm.valid) {
      this.isLoading = true;
      const operator: Operator = Object.assign(this.operatorForm.value);
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.operatorsService
            .addOperator(operator)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.addCsvParameter(res.id);
            })
        );
      } else {
        this.sub$.add(
          this.operatorsService
            .editOperator(operator)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  addCsvParameter(operatorId: number): void {
    const csvParameter: CsvParameter = new CsvParameter('', operatorId, null, null);
    this.sub$.add(
      this.csvParameterService
        .addCsvParameter(csvParameter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.dialogRef.close();
          this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
        })
    );
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    return this.operatorForm.controls[controlName].hasError(errorName);
  };
}
