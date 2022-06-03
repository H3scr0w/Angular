import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TelecomService } from '../../models/telecom-service-selector';
import { MessageService } from '../../service/message/message.service';
import { ITelecomServiceSelectorData } from '../telecom-service-selector/telecom-service-selector-data';

@Component({
  selector: 'stgo-telecom-service-selector-dialog',
  templateUrl: './telecom-service-selector-dialog.component.html',
  styleUrls: ['./telecom-service-selector-dialog.component.scss']
})
export class TelecomServiceSelectorDialogComponent implements OnInit {
  countryCode: string;
  operatorId: number;
  readOnlyOperator: boolean;

  constructor(
    public messageService: MessageService,
    public dialogRef: MatDialogRef<TelecomServiceSelectorDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ITelecomServiceSelectorData
  ) {}

  ngOnInit(): void {
    this.countryCode = this.data ? this.data.countryCode : null;
    this.operatorId = this.data ? this.data.operatorId : null;
    this.readOnlyOperator = this.data ? this.data.readOnlyOperator : false;
  }

  onServiceSelected(service: TelecomService): void {
    this.dialogRef.close(service);
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }
}
