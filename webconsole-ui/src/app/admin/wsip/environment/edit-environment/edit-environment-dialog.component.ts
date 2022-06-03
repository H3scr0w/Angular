import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { Environment } from '../../../../shared/models/environment.model';
import { EnvironmentService } from '../../../../shared/services/environment.service';

@Component({
  selector: 'stgo-edit-environment-dialog',
  templateUrl: './edit-environment-dialog.component.html',
  styleUrls: ['./edit-environment-dialog.component.css']
})
export class EditEnvironmentDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;
  private environmentSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditEnvironmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private environmentService: EnvironmentService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const environment: Environment = new Environment(
      this.formGroup.get('name')!.value,
      this.formGroup.get('code')!.value
    );
    this.environmentSubscription = this.environmentService
      .createOrUpdate(environment.code, environment)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnInit(): void {
    if (this.data.environment) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.environment.code),
        name: new FormControl(this.data.environment.name)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl()
      });
    }
  }

  ngOnDestroy(): void {
    if (this.environmentSubscription) {
      this.environmentSubscription.unsubscribe();
    }
  }
}
