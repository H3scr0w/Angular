import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Certificate } from '../../../../../shared/models/certificate.model';
import { DialogData } from '../../../../../shared/models/dialog-data.model';
import { Page } from '../../../../../shared/models/page.model';
import { CertificateService } from '../../../../../shared/services/certificate.service';
import { ConfigurationService } from '../../../../../shared/services/tools/incapsula/configuration.service';

@Component({
  selector: 'stgo-edit-incapsula-custom-cert-dialog',
  templateUrl: './edit-incapsula-custom-cert-dialog.component.html',
  styleUrls: ['./edit-incapsula-custom-cert-dialog.component.css']
})
export class EditIncapsulaCustomCertDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;

  certificate$: Observable<Certificate[]>;
  certifSelected = false;

  private confSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditIncapsulaCustomCertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private certificateService: CertificateService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      certificate: new FormControl()
    });

    this.certificate$ = this.formGroup.controls.certificate.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.certificateService
          .getAllCertificatesByName(query)
          .pipe(map((page: Page<Certificate>) => page.content));
      })
    );
  }

  ngOnDestroy(): void {
    if (this.confSubscription) {
      this.confSubscription.unsubscribe();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;
    const certificate: Certificate = this.formGroup.get('certificate')!.value;
    this.confSubscription = this.configurationService
      .uploadCertificate(this.data.domainCode, certificate.code)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  displayFn = (certificate: Certificate) => {
    if (certificate) {
      return certificate.name;
    }
    return '';
  }
}
