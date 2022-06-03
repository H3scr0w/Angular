import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Domain } from '../../../../../shared/models/domain.model';
import { DocrootService } from '../../../../../shared/services/docroot.service';
import { DomainService } from '../../../../../shared/services/domain.service';

@Component({
  selector: 'stgo-dialog-docrootenv-domain',
  templateUrl: './dialog-docrootenv-domain.component.html',
  styleUrls: ['./dialog-docrootenv-domain.component.css']
})
export class DialogDocrootenvDomainComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  domains$: Observable<Domain[]>;
  saving = false;
  domainSelected = false;
  private docrootEnvSubscription: ISubscription;

  constructor(
    private docrootService: DocrootService,
    private domainService: DomainService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<DialogDocrootenvDomainComponent>
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      domain: new FormControl()
    });

    this.domains$ = this.formGroup.controls.domain.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.domainService.getAllDomainsByName(query).pipe(map((page) => page.content));
      })
    );
  }

  confirm(): void {
    this.saving = true;

    const domain: Domain = this.formGroup.get('domain')!.value;

    this.docrootEnvSubscription = this.docrootService
      .createOrUpdateDomain(this.data.environmentCode, this.data.docrootCode, domain.code, domain)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy(): void {
    if (this.docrootEnvSubscription) {
      this.docrootEnvSubscription.unsubscribe();
    }
  }

  selectedObject(code: string): void {
    this.domainSelected = true;
  }

  displayFn = (domain: Domain) => {
    if (domain) {
      return domain.name;
    }
    return '';
  }
}
