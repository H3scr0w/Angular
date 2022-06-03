import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../shared/models/dialog-data.model';
@Component({
  styleUrls: ['./table-dialog.component.css'],
  selector: 'stgo-deployment-table-dialog',
  templateUrl: 'table-dialog.component.html'
})
export class TableDialogComponent {
  constructor(public dialogRef: MatDialogRef<TableDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyText(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.data.logs;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
