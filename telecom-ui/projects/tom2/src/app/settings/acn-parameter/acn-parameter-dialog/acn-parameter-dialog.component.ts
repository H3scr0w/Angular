import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AcnParameter } from '../../../shared/models/acn-parameter';
import { DeviceValuesList } from '../../../shared/models/device-values-list';
import { Networks } from '../../../shared/models/networks.model';
import { Page } from '../../../shared/models/page.model';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { DeviceValuesListService } from '../../../shared/service/device-values-list/device-values-list.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { AcnParameterDialogData } from './acn-parameter-dialog-data';
import { AcnParameterValidator } from './acn-parameter-validator';

@Component({
  selector: 'stgo-acn-parameter-dialog',
  templateUrl: './acn-parameter-dialog.component.html',
  styleUrls: ['./acn-parameter-dialog.component.css']
})
export class AcnParameterDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  networks: Observable<Networks[]>;
  deviceValuesList: Observable<DeviceValuesList[]>;
  inputDeviceValuesList: Subject<string> = new Subject<string>();
  inputNetwork: Subject<string> = new Subject<string>();
  reminders: any[] = [
    { label: 'No', value: 0 },
    { label: 'Mail', value: 1 },
    { label: 'Mail + Popup', value: 2 }
  ];
  private sub$: Subscription = new Subscription();

  acnParameterForm = this.fb.group({
    id: [''],
    network: ['', Validators.required],
    acn: ['', [Validators.required, Validators.minLength(1)]],
    reminder: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    private messageService: MessageService,
    private networksService: NetworksService,
    private acnParameterService: AcnParameterService,
    private deviceValuesListService: DeviceValuesListService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AcnParameterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AcnParameterDialogData
  ) {}

  ngOnInit() {
    this.networks = this.inputNetwork.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.networksService.getAllNetworks(value, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.deviceValuesList = this.inputDeviceValuesList.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.deviceValuesListService
          .getAllDeviceValuesList(0, 150, 'value', 'asc', value, 'Access_classification_number')
          .pipe(
            switchMap(result => {
              this.isLoading = false;
              return of(result.content);
            })
          );
      })
    );

    if (this.data) {
      this.acnParameterForm.patchValue({
        id: !this.data.acnParameter.id ? 0 : this.data.acnParameter.id,
        acn: !this.data.acnParameter.acn ? null : this.getAllDeviceList(),
        network: !this.data.acnParameter.network ? null : this.data.acnParameter.network,
        reminder: this.reminders.find(x => x.value === this.data.acnParameter.reminder)
      });
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.acnParameterForm.valid) {
      this.isLoading = true;
      const network: Networks = this.acnParameterForm.controls.network.value;
      const deviceValue: DeviceValuesList = this.acnParameterForm.controls.acn.value;
      const reminderVal = this.acnParameterForm.get('reminder').value;
      const acnParameter: AcnParameter = new AcnParameter(
        this.acnParameterForm.controls.id.value,
        network.id,
        deviceValue.value,
        reminderVal.value
      );
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.acnParameterService
            .addAcnParameter(acnParameter)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.acnParameterService
            .editAcnParameter(acnParameter)
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

  onAcnSelected(): void {
    this.acnParameterForm
      .get('acn')
      .setAsyncValidators([
        AcnParameterValidator.validateACNNumberNotTaken(this.acnParameterService, this.acnParameterForm)
      ]);
  }

  hasError = (controlName: string, errorName: string) => {
    if (this.data && this.data.mode === 'edit') {
      return this.acnParameterForm.controls[controlName].hasError(errorName);
    }
    return (
      this.acnParameterForm.controls[controlName].hasError(errorName) &&
      this.acnParameterForm.controls[controlName].touched
    );
  };

  private getAllDeviceList(): void {
    this.isLoading = true;
    this.sub$.add(
      this.deviceValuesListService
        .getAllDeviceValuesList(0, 150, 'value', 'asc', '', 'Access_classification_number')
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<DeviceValuesList>) => {
          if (page) {
            if (this.data.acnParameter.acn) {
              this.acnParameterForm.patchValue({
                acn: page.content.filter(acn => acn.value === this.data.acnParameter.acn)[0]
              });
            }
          }
        })
    );
  }
}
