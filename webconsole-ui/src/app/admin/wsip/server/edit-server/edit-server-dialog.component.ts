import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { Server } from '../../../../shared/models/server.model';
import { ServerService } from '../../../../shared/services/server.service';

@Component({
  selector: 'stgo-edit-server-dialog',
  templateUrl: './edit-server-dialog.component.html',
  styleUrls: ['./edit-server-dialog.component.css']
})
export class EditServerDialogComponent implements OnDestroy, OnInit {
  formGroup: FormGroup;
  saving = false;
  hideLogin = true;
  private serverSubscription: ISubscription;

  constructor(
    public dialogRef: MatDialogRef<EditServerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private serverService: ServerService
  ) {}

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const server: Server = new Server(
      this.formGroup.get('hostname')!.value,
      this.formGroup.get('domain')!.value,
      this.formGroup.get('enable')!.value,
      this.formGroup.get('login')!.value,
      this.formGroup.get('sshServer')!.value
    );
    this.serverSubscription = this.serverService
      .createOrUpdate(server.hostname!, server)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnInit(): void {
    if (this.data.server) {
      this.formGroup = new FormGroup({
        hostname: new FormControl(this.data.server.hostname),
        domain: new FormControl(this.data.server.domain),
        enable: new FormControl(this.data.server.enable),
        login: new FormControl(this.data.server.login),
        sshServer: new FormControl(this.data.server.sshServer)
      });
    } else {
      this.formGroup = new FormGroup({
        hostname: new FormControl('', [Validators.required]),
        domain: new FormControl('', [Validators.required]),
        enable: new FormControl(false),
        login: new FormControl('', [Validators.required, Validators.email]),
        sshServer: new FormControl(false)
      });
    }
  }

  ngOnDestroy(): void {
    if (this.serverSubscription) {
      this.serverSubscription.unsubscribe();
    }
  }
}
