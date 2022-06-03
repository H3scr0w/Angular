import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../shared/models/dialog-data.model';
import { DeploymentService } from '../../../shared/services/deployment.service';

@Component({
  selector: 'stgo-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit, OnDestroy {
  saving = false;

  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public deploymentService: DeploymentService
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.saving = true;
    this.sub$.add(this.deploymentService
      .cancel(this.data.deployment.deploymentId)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(1)));
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
