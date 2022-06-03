import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../../../shared/models/dialog-data.model';
import { ServerRecord } from '../../../../../../shared/models/tools/qualys/server-record.model';
import { Fields } from '../../../../../../shared/models/tools/qualys/util/fields.model';
import { ListWrapper } from '../../../../../../shared/models/tools/qualys/util/list-wrapper.model';
import { SetWrapper } from '../../../../../../shared/models/tools/qualys/util/set-wrapper.model';
import { WebAppAuthServerRecordField } from '../../../../../../shared/models/tools/qualys/webappauth-serverrecord-field.model';
import { WebAppAuthRecord } from '../../../../../../shared/models/tools/qualys/webappauthrecord.model';
import { WebappauthrecordService } from '../../../../../../shared/services/tools/qualys/webappauthrecord.service';

@Component({
  selector: 'stgo-add-serverrecord-dialog',
  templateUrl: './add-serverrecord-dialog.component.html',
  styleUrls: ['./add-serverrecord-dialog.component.css']
})
export class AddServerRecordDialogComponent implements OnInit, OnDestroy {
  types = ['BASIC', 'NTLM', 'DIGEST'];
  formGroup: FormGroup;
  webAppAuthRecord: WebAppAuthRecord;
  serverRecord: WebAppAuthServerRecordField;
  saving = false;
  hidePassword = true;

  private saveSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AddServerRecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private webappauthrecordService: WebappauthrecordService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      type: new FormControl('BASIC', [Validators.required]),
      domain: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl()
    });

    this.webAppAuthRecord = this.data.webAppAuthRecord;
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.saving = true;
    this.serverRecord = new WebAppAuthServerRecordField();
    this.serverRecord.type = this.formGroup.get('type')!.value;
    this.serverRecord.domain = this.formGroup.get('domain')!.value;
    this.serverRecord.username = this.formGroup.get('username')!.value;
    this.serverRecord.password = this.formGroup.get('password')!.value;

    if (!this.webAppAuthRecord.serverRecord) {
      this.webAppAuthRecord.serverRecord = new ServerRecord();
      this.webAppAuthRecord.serverRecord.fields = new Fields<WebAppAuthServerRecordField>();
    }

    const serverRecords: WebAppAuthServerRecordField[] = this.webAppAuthRecord.serverRecord.fields.list.map(
      (wrapper: ListWrapper<WebAppAuthServerRecordField>) => {
        wrapper.WebAppAuthServerRecordField.id = null!;
        return wrapper.WebAppAuthServerRecordField;
      }
    );

    this.webAppAuthRecord.serverRecord.fields.set = new SetWrapper<WebAppAuthServerRecordField>();
    this.webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField = serverRecords;
    this.webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField.push(this.serverRecord);

    const serverRecordWrapper: ListWrapper<WebAppAuthServerRecordField> = new ListWrapper<
      WebAppAuthServerRecordField
    >();
    serverRecordWrapper.WebAppAuthServerRecordField = this.serverRecord;
    this.webAppAuthRecord.serverRecord.fields.list.push(serverRecordWrapper);

    this.saveSubscription = this.webappauthrecordService
      .updateWebAppAuthRecord(this.webAppAuthRecord.id, this.webAppAuthRecord)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}
