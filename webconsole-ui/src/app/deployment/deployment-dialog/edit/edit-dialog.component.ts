import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Command } from '../../../shared/models/command.model';
import { DialogData } from '../../../shared/models/dialog-data.model';
import { DeploymentService } from '../../../shared/services/deployment.service';
import { HelperService } from '../../../shared/services/helper.service';

@Component({
  selector: 'stgo-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnDestroy {
  cmdParam = new FormControl();
  ELEMENT_DATA: Command[] = [];
  displayedColumns: string[] = ['command', 'param', 'order', 'actions'];
  saving = false;

  private deploySubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private deploymentService: DeploymentService,
    private helperService: HelperService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmEdit(): void {
    this.saving = true;
    this.deploySubscription = this.deploymentService
      .editComands(this.data.editDataSource.data, this.data.deployment.deploymentId)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(1));
  }

  addCmd(): void {
    this.ELEMENT_DATA = this.data.editDataSource.data;
    this.ELEMENT_DATA.push(new Command('drush', this.ELEMENT_DATA.length + 1, this.cmdParam.value));
    this.data.editDataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  deleteCmd(command: Command): void {
    this.data.editDataSource.data = this.data.editDataSource.data.filter((c) => c.order !== command.order);
  }

  moveUp(cmd: Command): void {
    this.data.editDataSource = this.helperService.moveUp(cmd, this.data.editDataSource);
  }

  moveDown(cmd: Command): void {
    this.data.editDataSource = this.helperService.moveDown(cmd, this.data.editDataSource);
  }

  ngOnDestroy(): void {
    if (this.deploySubscription) {
      this.deploySubscription.unsubscribe();
    }
  }
}
