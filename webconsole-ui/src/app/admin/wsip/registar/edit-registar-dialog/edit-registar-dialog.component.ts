import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { Registar } from '../../../../shared/models/registar.model';
import { RegistarService } from '../../../../shared/services/registar.service';

@Component({
  selector: 'stgo-edit-registar-dialog',
  templateUrl: './edit-registar-dialog.component.html',
  styleUrls: ['./edit-registar-dialog.component.css']
})
export class EditRegistarDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  private registarSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditRegistarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private registarService: RegistarService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const registar: Registar = new Registar(this.formGroup.get('name')!.value, this.formGroup.get('code')!.value);
    this.registarSubscription = this.registarService
      .createOrUpdate(registar.code, registar)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnInit(): void {
    if (this.data.registar) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.registar.code),
        name: new FormControl(this.data.registar.name)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl()
      });
    }
  }

  ngOnDestroy(): void {
    if (this.registarSubscription) {
      this.registarSubscription.unsubscribe();
    }
  }
}
