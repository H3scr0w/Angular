import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { DocrootCore } from '../../../../shared/models/docrootcore.model';
import { DrupalDocrootCoreService } from '../../../../shared/services/drupaldocrootcore.service';

@Component({
  selector: 'stgo-edit-docrootcore-dialog',
  templateUrl: './edit-docrootcore-dialog.component.html',
  styleUrls: ['./edit-docrootcore-dialog.component.css']
})
export class EditDocrootcoreDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;
  private docrootcoreSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditDocrootcoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private drupalDocrootCoreService: DrupalDocrootCoreService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const docrootcore: DocrootCore = new DocrootCore(
      this.formGroup.get('code')!.value,
      this.formGroup.get('name')!.value,
      this.formGroup.get('codeRepositoryUrl')!.value,
      this.formGroup.get('binaryRepositoryUrl')!.value
    );
    this.docrootcoreSubscription = this.drupalDocrootCoreService
      .createOrUpdate(docrootcore, docrootcore.code)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close());
  }

  ngOnInit(): void {
    if (this.data.docrootcore) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.docrootcore.code),
        name: new FormControl(this.data.docrootcore.name),
        codeRepositoryUrl: new FormControl(this.data.docrootcore.codeRepositoryUrl),
        binaryRepositoryUrl: new FormControl(this.data.docrootcore.binaryRepositoryUrl)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        codeRepositoryUrl: new FormControl(''),
        binaryRepositoryUrl: new FormControl('')
      });
    }
  }

  ngOnDestroy(): void {
    if (this.docrootcoreSubscription) {
      this.docrootcoreSubscription.unsubscribe();
    }
  }
}
