import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { HostingProvider } from '../../../../shared/models/hosting-provider.model';
import { HostingProviderService } from '../../../../shared/services/hosting-provider.service';

@Component({
  selector: 'stgo-edit-hosting-provider-dialog',
  templateUrl: './edit-hosting-provider-dialog.component.html',
  styleUrls: ['./edit-hosting-provider-dialog.component.css']
})
export class EditHostingProviderDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  private hostingProviderSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditHostingProviderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private hostingProviderService: HostingProviderService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const hostingProvider: HostingProvider = new HostingProvider(
      this.formGroup.get('name')!.value,
      this.formGroup.get('code')!.value
    );
    this.hostingProviderSubscription = this.hostingProviderService
      .createOrUpdate(hostingProvider.code, hostingProvider)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnInit(): void {
    if (this.data.hostingProvider) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.hostingProvider.code),
        name: new FormControl(this.data.hostingProvider.name)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl()
      });
    }
  }

  ngOnDestroy(): void {
    if (this.hostingProviderSubscription) {
      this.hostingProviderSubscription.unsubscribe();
    }
  }
}
