import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Certificate } from '../../../../shared/models/certificate.model';
import { DialogData } from '../../../../shared/models/dialog-data.model';
import { CertificateService } from '../../../../shared/services/certificate.service';

@Component({
  selector: 'stgo-edit-certificate-dialog',
  templateUrl: './edit-certificate-dialog.component.html',
  styleUrls: ['./edit-certificate-dialog.component.css']
})
export class EditCertificateDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;
  hidePassword = true;
  certFileName: string;
  keyFileName: string;
  certFileInput: File;
  keyFileInput: File;

  private certificateSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    if (this.data.certificate) {
      this.formGroup = new FormGroup({
        code: new FormControl(this.data.certificate.code),
        name: new FormControl(this.data.certificate.name),
        passphrase: new FormControl(this.data.certificate.passphrase)
      });
    } else {
      this.formGroup = new FormGroup({
        code: new FormControl(),
        name: new FormControl(),
        passphrase: new FormControl()
      });
    }
  }

  ngOnDestroy(): void {
    if (this.certificateSubscription) {
      this.certificateSubscription.unsubscribe();
    }
  }

  selectFile(cert: boolean, event: Event): void {
    const target = event?.target as HTMLInputElement;
    const files = target?.files;
    if (cert) {
      if (files && files.length) {
        this.certFileName = files[0].name;
        this.certFileInput = files[0];
      } else {
        this.certFileName = '';
      }
    } else {
      if (files && files.length) {
        this.keyFileName = files[0].name;
        this.keyFileInput = files[0];
      } else {
        this.keyFileName = '';
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    const certicate: Certificate = new Certificate();
    certicate.code = this.formGroup.get('code')!.value;
    certicate.name = this.formGroup.get('name')!.value;
    certicate.passphrase = this.formGroup.get('passphrase')!.value;

    this.certificateSubscription = this.certificateService
      .createOrUpdate(certicate.code, certicate, this.certFileInput, this.keyFileInput)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }
}
