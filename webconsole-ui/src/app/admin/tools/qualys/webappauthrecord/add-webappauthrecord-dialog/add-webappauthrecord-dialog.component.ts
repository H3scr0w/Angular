import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ServerRecord } from '../../../../../shared/models/tools/qualys/server-record.model';
import { Fields } from '../../../../../shared/models/tools/qualys/util/fields.model';
import { SetWrapper } from '../../../../../shared/models/tools/qualys/util/set-wrapper.model';
import { WebAppAuthServerRecordField } from '../../../../../shared/models/tools/qualys/webappauth-serverrecord-field.model';
import { WebAppAuthRecord } from '../../../../../shared/models/tools/qualys/webappauthrecord.model';
import { WebappauthrecordService } from '../../../../../shared/services/tools/qualys/webappauthrecord.service';

@Component({
  selector: 'stgo-add-webappauthrecord-dialog',
  templateUrl: './add-webappauthrecord-dialog.component.html',
  styleUrls: ['./add-webappauthrecord-dialog.component.css']
})
export class AddWebAppAuthRecordDialogComponent implements OnInit, OnDestroy {
  ELEMENT_DATA: WebAppAuthServerRecordField[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'type', 'domain', 'username', 'password', 'actions'];
  formGroup: FormGroup;

  types = ['BASIC', 'NTLM', 'DIGEST'];
  serverFormGroup: FormGroup;

  id = 0;
  saving = false;
  hidePassword = true;
  hide = true;
  private saveSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<AddWebAppAuthRecordDialogComponent>,
    private webappauthrecordService: WebappauthrecordService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required])
    });

    this.serverFormGroup = new FormGroup({
      type: new FormControl('BASIC', [Validators.required]),
      domain: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl()
    });
  }

  ngOnDestroy(): void {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    const webAppAuthRecord: WebAppAuthRecord = new WebAppAuthRecord();
    webAppAuthRecord.name = this.formGroup.get('name')!.value;
    webAppAuthRecord.serverRecord = new ServerRecord();
    webAppAuthRecord.serverRecord.fields = new Fields<WebAppAuthServerRecordField>();
    webAppAuthRecord.serverRecord.fields.set = new SetWrapper<WebAppAuthServerRecordField>();
    webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField = [];
    webAppAuthRecord.serverRecord.fields.set.WebAppAuthServerRecordField = this.dataSource.data;

    this.saveSubscription = this.webappauthrecordService
      .createWebAppAuthRecord(webAppAuthRecord)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  add(): void {
    this.ELEMENT_DATA = this.dataSource.data;

    const serverRecord: WebAppAuthServerRecordField = new WebAppAuthServerRecordField();

    serverRecord.type = this.serverFormGroup.get('type')!.value;
    serverRecord.domain = this.serverFormGroup.get('domain')!.value;
    serverRecord.username = this.serverFormGroup.get('username')!.value;
    serverRecord.password = this.serverFormGroup.get('password')!.value;

    this.ELEMENT_DATA.push(serverRecord);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  delete(webAppServerRecord: WebAppAuthServerRecordField): void {
    this.dataSource.data = this.dataSource.data.filter(
      (serverRecord) => serverRecord.domain !== webAppServerRecord.domain
    );
  }
}
