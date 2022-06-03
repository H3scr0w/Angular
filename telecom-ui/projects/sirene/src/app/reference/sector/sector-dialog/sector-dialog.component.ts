import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Sector, SectorService } from '@shared';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SectorDialogData } from './sector-dialog-data';
import { SectorValidator } from './sector-validator';

@Component({
  selector: 'stgo-sector-dialog',
  templateUrl: './sector-dialog.component.html',
  styleUrls: ['./sector-dialog.component.scss']
})
export class SectorDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  sectors: Observable<Sector[]>;
  private saveSubscription: Subscription;

  sectorForm = this.fb.group({
    id: [
      '',
      {
        Validators: [Validators.required, Validators.maxLength(2)],
        asyncValidators: [SectorValidator.validateSectorIdNotTaken(this.sectorService, null)],
        updateOn: 'blur'
      }
    ],
    name: [
      '',
      {
        Validators: [Validators.required],
        asyncValidators: [SectorValidator.validateSectorNameNotTaken(this.sectorService, null)],
        updateOn: 'blur'
      }
    ]
  });

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private sectorService: SectorService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SectorDialogData
  ) {}

  ngOnInit() {
    if (this.data) {
      this.sectorForm.setValue({
        id: this.data.sector.id,
        name: this.data.sector.name
      });
      if (this.data.mode === 'edit') {
        this.sectorForm
          .get('id')
          .setAsyncValidators([
            SectorValidator.validateSectorIdNotTaken(this.sectorService, this.sectorForm.get('id').value)
          ]);
        this.sectorForm
          .get('name')
          .setAsyncValidators([
            SectorValidator.validateSectorNameNotTaken(this.sectorService, this.sectorForm.get('name').value)
          ]);
      }
    }
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.sectorForm.valid) {
      this.isLoading = true;
      const sector: Sector = Object.assign({}, this.sectorForm.value);
      sector.lastUser = this.authenticationService.credentials.sgid;
      if (this.data && this.data.mode === 'add') {
        this.saveSubscription = this.sectorService
          .addSector(sector)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      } else {
        this.saveSubscription = this.sectorService
          .editSector(sector)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      }
    }
  }

  onCloseClick(): void {
    this.dialogRef.close('close');
  }

  onInitialsInput(input: string) {
    this.sectorForm.get('id').setValue(input.toUpperCase());
  }

  hasError = (controlName: string, errorName: string) => {
    return this.sectorForm.controls[controlName].hasError(errorName);
  };
}
