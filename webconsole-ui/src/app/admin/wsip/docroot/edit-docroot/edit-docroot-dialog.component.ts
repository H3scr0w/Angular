import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, SubscriptionLike as ISubscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { HostingProvider } from 'src/app/shared/models/hosting-provider.model';
import { Page } from 'src/app/shared/models/page.model';
import { HostingProviderService } from 'src/app/shared/services/hosting-provider.service';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { Docroot } from '../../../../shared/models/docroot.model';
import { DocrootService } from '../../../../shared/services/docroot.service';

@Component({
  selector: 'stgo-edit-docroot-dialog',
  templateUrl: './edit-docroot-dialog.component.html',
  styleUrls: ['./edit-docroot-dialog.component.css']
})
export class EditDocrootDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;

  hostingProvider$: Observable<HostingProvider[]>;
  hasHostingProviderSelected = false;
  hostingProvider: HostingProvider;

  private docrootSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditDocrootDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private docrootService: DocrootService,
    private hostingProviderService: HostingProviderService
  ) {}

  ngOnInit(): void {
    if (this.data.docroot) {
      this.hasHostingProviderSelected = true;
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.docroot.code),
        name: new FormControl(this.data.docroot.name),
        rundeckJobApiUrl: new FormControl(this.data.docroot.rundeckJobApiUrl),
        hostingProvider: new FormControl({
          code: this.data.docroot.hostingProviderCode,
          name: this.data.docroot.hostingProviderName
        }),
        providerInternalId: new FormControl(this.data.docroot.providerInternalId)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        rundeckJobApiUrl: new FormControl(),
        hostingProvider: new FormControl(),
        providerInternalId: new FormControl()
      });
    }

    this.hostingProvider$ = this.formGroup.controls.hostingProvider.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.hostingProviderService
          .getAllHostingProvidersByName(query)
          .pipe(map((page: Page<HostingProvider>) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.docrootSubscription) {
      this.docrootSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const docroot: Docroot = new Docroot(
      this.formGroup.get('code')!.value,
      this.formGroup.get('name')!.value,
      this.formGroup.get('rundeckJobApiUrl')!.value,
      this.formGroup.get('providerInternalId')!.value
    );
    docroot.hostingProviderCode = this.hostingProvider
      ? this.hostingProvider.code
      : this.data.docroot.hostingProviderCode;

    this.docrootSubscription = this.docrootService
      .createOrUpdate(docroot, docroot.code)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close());
  }

  selectHostingProvider(action: boolean, hostingProviderSelected?: HostingProvider): void {
    if (hostingProviderSelected) {
      this.hostingProvider = hostingProviderSelected;
    }
    this.hasHostingProviderSelected = action;
  }

  displayFn = (hostingProvider: HostingProvider) => {
    if (hostingProvider) {
      return hostingProvider.name;
    }
    return '';
  }
}
