import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { AccessRightService } from '../../../../../shared/services/access-right.service';
import { EditUserComponent } from '../../../dialog/edit-user/edit-user.component';

@Component({
  selector: 'stgo-delete-right',
  templateUrl: './delete-right.component.html',
  styleUrls: ['./delete-right.component.scss']
})
export class DeleteRightComponent implements OnInit, OnDestroy {
  deleting = false;

  private deleteSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private accessRightService: AccessRightService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.deleteSubscription = this.accessRightService
      .deleteAccessRight(this.data.right.accessRightId)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
