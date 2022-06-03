import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { OperatorParameter } from '../../../shared/models/operator-parameter';
import { Operator } from '../../../shared/models/operators';
import { MessageService } from '../../../shared/service/message/message.service';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { OperatorParameterDialogData } from './operator-parameter-dialog-data';
import { OperatorParameterValidator } from './operator-parameter-validator';

@Component({
  selector: 'stgo-operator-parameter-dialog',
  templateUrl: './operator-parameter-dialog.component.html',
  styleUrls: ['./operator-parameter-dialog.component.css']
})
export class OperatorParameterDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isReadOnly: boolean;
  operators: Observable<Operator[]>;
  inputOperator: Subject<string> = new Subject<string>();

  private sub$: Subscription = new Subscription();

  operatorParameterForm = this.fb.group({
    id: [''],
    operator: ['', Validators.required],
    type: ['', [Validators.required, Validators.minLength(1)]],
    label: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private messageService: MessageService,
    private operatorsService: OperatorsService,
    private operatorParameterService: OperatorParameterService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OperatorParameterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OperatorParameterDialogData
  ) {}

  ngOnInit() {
    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorsService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    if (this.data) {
      this.operatorParameterForm.patchValue({
        id: !this.data.operatorParameter.id ? 0 : this.data.operatorParameter.id,
        type: !this.data.operatorParameter.type ? null : this.data.operatorParameter.type,
        label: !this.data.operatorParameter.label ? null : this.data.operatorParameter.label,
        operator: !this.data.operatorParameter.operator ? null : this.data.operatorParameter.operator
      });
      this.operatorParameterForm
        .get('label')
        .setAsyncValidators([
          OperatorParameterValidator.validateLabelNotTaken(this.operatorParameterService, this.operatorParameterForm)
        ]);
    } else {
      this.operatorParameterForm
        .get('label')
        .setAsyncValidators([
          OperatorParameterValidator.validateLabelNotTaken(this.operatorParameterService, this.operatorParameterForm)
        ]);
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.operatorParameterForm.valid) {
      this.isLoading = true;
      const operator: Operator = this.operatorParameterForm.controls.operator.value;
      const operatorParameter: OperatorParameter = new OperatorParameter(
        this.operatorParameterForm.controls.id.value,
        operator.id,
        this.operatorParameterForm.controls.type.value,
        this.operatorParameterForm.controls.label.value
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.operatorParameterService
            .addOperatorParameter(operatorParameter)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.isReadOnly = true;
        this.sub$.add(
          this.operatorParameterService
            .editOperatorParameter(operatorParameter)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    if (this.data && this.data.mode === 'edit') {
      return this.operatorParameterForm.controls[controlName].hasError(errorName);
    }
    return (
      this.operatorParameterForm.controls[controlName].hasError(errorName) &&
      this.operatorParameterForm.controls[controlName].touched
    );
  };
}
