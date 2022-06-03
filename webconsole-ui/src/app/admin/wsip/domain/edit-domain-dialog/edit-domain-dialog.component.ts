import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { Domain } from '../../../../shared/models/domain.model';
import { Page } from '../../../../shared/models/page.model';
import { Registar } from '../../../../shared/models/registar.model';
import { DomainService } from '../../../../shared/services/domain.service';
import { RegistarService } from '../../../../shared/services/registar.service';

@Component({
  selector: 'stgo-edit-domain-dialog',
  templateUrl: './edit-domain-dialog.component.html',
  styleUrls: ['./edit-domain-dialog.component.css']
})
export class EditDomainDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  hidePassword = true;
  private domainSubscription: ISubscription;

  registar$: Observable<Registar[]>;
  hasRegistarSelected = false;
  registar: Registar;

  constructor(
    public dialogRef: MatDialogRef<EditDomainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private domainService: DomainService,
    private registarService: RegistarService
  ) {}

  ngOnInit(): void {
    if (this.data.domain) {
      this.hasRegistarSelected = true;
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.domain.code),
        name: new FormControl(this.data.domain.name),
        registar: new FormControl({ code: this.data.domain.registarCode, name: this.data.domain.registarName }),
        wafId: new FormControl(this.data.domain.wafId),
        realm: new FormControl(this.data.domain.realm),
        user: new FormControl(this.data.domain.user),
        password: new FormControl(this.data.domain.password),
        useDocrootEnvAuth: new FormControl(this.data.domain.useDocrootEnvAuth),
        isBasicAuth: new FormControl(this.data.domain.isBasicAuth),
        isQualysEnable: new FormControl(this.data.domain.isQualysEnable),
        httpsEnable: new FormControl(this.data.domain.httpsEnable)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        registar: new FormControl(),
        wafId: new FormControl(),
        realm: new FormControl(),
        user: new FormControl(),
        password: new FormControl(),
        useDocrootEnvAuth: new FormControl(),
        isBasicAuth: new FormControl(),
        isQualysEnable: new FormControl(),
        httpsEnable: new FormControl()
      });
    }

    this.registar$ = this.formGroup.controls.registar.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.registarService.getAllRegistarsByName(query).pipe(map((page: Page<Registar>) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.domainSubscription) {
      this.domainSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const domain: Domain = new Domain();
    domain.name = this.formGroup.get('name')!.value;
    domain.code = this.formGroup.get('code')!.value;
    domain.registarCode = this.registar ? this.registar.code : this.data.domain.registarCode;
    domain.wafId = this.formGroup.get('wafId')!.value;
    domain.realm = this.formGroup.get('realm')!.value;
    domain.user = this.formGroup.get('user')!.value;
    domain.password = this.formGroup.get('password')!.value;
    domain.useDocrootEnvAuth = this.formGroup.get('useDocrootEnvAuth')!.value;
    domain.isBasicAuth = this.formGroup.get('isBasicAuth')!.value;
    domain.isQualysEnable = this.formGroup.get('isQualysEnable')!.value;
    domain.httpsEnable = this.formGroup.get('httpsEnable')!.value;

    this.domainSubscription = this.domainService
      .createOrUpdate(domain.code, domain)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  selectRegistar(action: boolean, registarSelected?: Registar): void {
    if (registarSelected) {
      this.registar = registarSelected;
    }
    this.hasRegistarSelected = action;
  }

  displayFn = (registar: Registar) => {
    if (registar) {
      return registar.name;
    }
    return '';
  }
}
