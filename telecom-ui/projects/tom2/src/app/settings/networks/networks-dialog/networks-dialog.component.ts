import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Networks } from '../../../shared/models/networks.model';
import { Operator } from '../../../shared/models/operators';
import { MessageService } from '../../../shared/service/message/message.service';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';

@Component({
  selector: 'stgo-networks',
  templateUrl: './networks-dialog.component.html',
  styleUrls: ['./networks-dialog.component.css']
})
export class NetworksDialogComponent implements OnInit, OnDestroy {
  isLoading = false;
  inputOperators: Subject<string> = new Subject<string>();
  id: number;
  operators: Observable<Operator[]>;
  networksForm = this.fb.group({
    code: [
      '',
      {
        validators: [Validators.required]
      }
    ],
    name: [
      '',
      {
        validators: [Validators.required]
      }
    ],
    operator: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NetworksDialogComponent>,
    private networkService: NetworksService,
    private operatorService: OperatorsService,
    private messageService: MessageService,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.operators = this.inputOperators.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.operatorService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );

    if (this.data) {
      this.networksForm.setValue({
        code: this.data.networks.code,
        name: this.data.networks.name || null,
        operator: this.data.networks.operator || null
      });

      if (this.data.mode === 'add') {
        this.networksForm.get('operator').setValue(null);
      }
      if (this.data.mode === 'edit') {
        this.id = this.data.networks.id;
      }
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.networksForm.controls[controlName].hasError(errorName);
  };

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSubmit(): void {
    if (this.networksForm.valid) {
      this.isLoading = true;
      const networks: Networks = Object.assign({}, this.networksForm.value);
      const operators: Operator = this.networksForm.get('operator').value;
      if (operators) {
        networks.operatorId = operators.id;
      }
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.networkService
            .addNetwork(networks)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        networks.id = this.id;
        this.sub$.add(
          this.networkService
            .editNetwork(networks)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }
}
