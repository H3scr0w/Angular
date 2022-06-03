import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Sector, SectorService, Zone, ZoneService } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { DialogData } from '../zone-list/zone-list.component';
import { ZoneValidator } from './zone-validator';

@Component({
  selector: 'stgo-zone-dialog',
  templateUrl: './zone-dialog.component.html',
  styleUrls: ['./zone-dialog.component.css']
})
export class ZoneDialogComponent implements OnInit, OnDestroy {
  sectors: Observable<Sector[]>;
  isLoading: boolean;
  private saveSubscription: Subscription;
  inputSector: Subject<string> = new Subject<string>();
  zoneForm = this.fb.group({
    initials: [
      '',
      {
        Validators: [Validators.required],
        asyncValidators: [ZoneValidator.validateZoneIdNotTaken(this.zoneService, null)],
        updateOn: 'blur'
      }
    ],
    name: [
      '',
      {
        Validators: [Validators.required],
        asyncValidators: [ZoneValidator.validateZoneNameNotTaken(this.zoneService, null)],
        updateOn: 'blur'
      }
    ],
    sector: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ZoneDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private sectorService: SectorService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private zoneService: ZoneService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (this.data) {
      this.zoneForm.setValue({
        name: this.data.zone.name,
        initials: this.data.zone.id,
        sector: this.data.zone.sector
      });
      if (this.data.mode === 'add') {
        this.zoneForm.controls.sector.setValue(null);
      }
      if (this.data.mode === 'edit') {
        this.zoneForm
          .get('initials')
          .setAsyncValidators([
            ZoneValidator.validateZoneIdNotTaken(this.zoneService, this.zoneForm.get('initials').value)
          ]);
        this.zoneForm
          .get('name')
          .setAsyncValidators([
            ZoneValidator.validateZoneNameNotTaken(this.zoneService, this.zoneForm.get('name').value)
          ]);
      }
    }

    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.sectorService.getAllSectors(query, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );
  }

  ngOnDestroy() {
    if (this.saveSubscription) {
      this.saveSubscription.unsubscribe();
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.zoneForm.controls[controlName].hasError(errorName) && this.zoneForm.controls[controlName].touched;
  };

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSubmit() {
    if (this.zoneForm.valid) {
      this.isLoading = true;
      const zone: Zone = Object.assign(this.zoneForm.value);
      if (this.data && this.data.zone && this.data.zone.creationDate) {
        zone.creationDate = this.data.zone.creationDate;
      }
      zone.lastUser = this.authenticationService.credentials.sgid;
      zone.id = this.zoneForm.controls.initials.value;
      if (this.data && this.data.mode === 'add') {
        this.saveSubscription = this.zoneService
          .addZone(zone)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      } else {
        this.saveSubscription = this.zoneService
          .editZone(zone)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
          });
      }
    }
  }
}
