import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Cms } from '../../../../shared/models/cms.model';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { CmsService } from '../../../../shared/services/cms.service';

@Component({
  selector: 'stgo-edit-cms-dialog',
  templateUrl: './edit-cms-dialog.component.html',
  styleUrls: ['./edit-cms-dialog.component.css']
})
export class EditCmsDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;
  private cmsSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditCmsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cmsService: CmsService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const cms: Cms = new Cms(
      this.formGroup.get('code')!.value,
      this.formGroup.get('name')!.value,
      this.formGroup.get('codeRepositoryUrl')!.value,
      this.formGroup.get('binaryRepositoryUrl')!.value
    );
    this.cmsSubscription = this.cmsService
      .createOrUpdate(cms, cms.code)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close());
  }

  ngOnInit(): void {
    if (this.data.cms) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.cms.code),
        name: new FormControl(this.data.cms.name),
        codeRepositoryUrl: new FormControl(this.data.cms.codeRepositoryUrl, [Validators.pattern('^https?://.+')]),
        binaryRepositoryUrl: new FormControl(this.data.cms.binaryRepositoryUrl, [Validators.pattern('^https?://.+')])
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        codeRepositoryUrl: new FormControl('', [Validators.pattern('^https?://.+')]),
        binaryRepositoryUrl: new FormControl('', [Validators.pattern('^https?://.+')])
      });
    }
  }

  ngOnDestroy(): void {
    if (this.cmsSubscription) {
      this.cmsSubscription.unsubscribe();
    }
  }
}
