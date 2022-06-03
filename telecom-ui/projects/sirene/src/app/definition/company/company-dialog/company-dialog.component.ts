import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import {
  Company,
  CompanyService,
  MessageService,
  Page,
  Sector,
  SectorService,
  Zone,
  ZoneFilter,
  ZoneService
} from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Contact } from '../../../shared/models/contact';
import { CompanyDialogData } from './company-dialog-data';
import { CompanyValidator } from './company-validator';

@Component({
  selector: 'stgo-company-dialog',
  templateUrl: './company-dialog.component.html',
  styleUrls: ['./company-dialog.component.scss']
})
export class CompanyDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  sectors: Observable<Sector[]>;
  zones: Zone[];
  rsmAttached: Contact;
  isViewOnly = false;
  isAdmin: boolean;
  isRsm: boolean;
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  companyForm: FormGroup;

  private sub$: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CompanyDialogData
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;

    this.companyForm = this.fb.group({
      sifCode: [
        { value: '', disabled: !this.isAdmin && !this.isRsm },
        {
          Validators: [Validators.required],
          asyncValidators: [CompanyValidator.validateCompanySifcodeNotTaken(this.companyService, null)],
          updateOn: 'blur'
        }
      ],
      companyName: [
        { value: '', disabled: !this.isAdmin && !this.isRsm },
        {
          Validators: [Validators.required],
          asyncValidators: [CompanyValidator.validateCompanyNameNotTaken(this.companyService, null)],
          updateOn: 'blur'
        }
      ],
      comments: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      sector: [{ value: '', disabled: !this.isAdmin && !this.isRsm }],
      zone: [{ value: '', disabled: !this.isAdmin && !this.isRsm }]
    });

    if (this.data && this.data.mode === 'view') {
      this.isViewOnly = true;
    }

    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.sectorService.getAllSectors(value, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.inputZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const selectedSector: Sector = this.companyForm.get('sector').value;
      const zoneFilter: ZoneFilter = new ZoneFilter();
      if (selectedSector && selectedSector.id) {
        zoneFilter.sector = selectedSector;
      }
      if (value) {
        zoneFilter.name = value;
      }
      this.getAllZones(zoneFilter);
    });

    if (this.data) {
      if (this.data.mode === 'edit' || this.isViewOnly) {
        this.companyForm.setValue({
          companyName: this.data.company.companyName,
          sifCode: this.data.company.sifCode,
          comments: this.data.company.comments,
          sector: this.data.company.zone.sector,
          zone: this.data.company.zone
        });
        this.companyForm
          .get('sifCode')
          .setAsyncValidators([
            CompanyValidator.validateCompanySifcodeNotTaken(this.companyService, this.companyForm.get('sifCode').value)
          ]);
        this.companyForm
          .get('companyName')
          .setAsyncValidators([
            CompanyValidator.validateCompanyNameNotTaken(this.companyService, this.companyForm.get('companyName').value)
          ]);

        this.sub$.add(
          this.companyService.getCompanyById(this.data.company.sifCode).subscribe(com => {
            this.rsmAttached = com.rsmAttached;
          })
        );
      } else if (this.data.mode === 'add') {
        this.companyForm.controls.sector.setValue(null);
        this.companyForm.controls.zone.setValue(null);
      }
    }
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
  }

  onSectorSelected() {
    this.companyForm.get('zone').setValue(null);
    const zoneFilter: ZoneFilter = new ZoneFilter();
    zoneFilter.sector = this.companyForm.get('sector').value;
    this.getAllZones(zoneFilter);
  }

  onZoneSelected() {
    const selectedZone: Zone = this.companyForm.get('zone').value;
    this.companyForm.get('sector').setValue(selectedZone ? selectedZone.sector : null);
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.companyForm.controls[controlName].hasError(errorName) && this.companyForm.controls[controlName].touched;
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      this.isLoading = true;
      const company: Company = Object.assign(this.companyForm.value);
      company.lastUser = this.authenticationService.credentials.sgid;
      if (this.data && this.data.mode === 'add') {
        this.sub$.add(
          this.companyService
            .addCompany(company)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else {
        this.sub$.add(
          this.companyService
            .editCompany(company)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSifCodeInput(input: string) {
    this.companyForm.get('sifCode').setValue(input.toUpperCase());
  }

  private getAllZones(zoneFilter?: ZoneFilter): void {
    this.isLoading = true;
    this.sub$.add(
      this.zoneService
        .getAllZones('', 0, 100, '', 'name', 'asc', zoneFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Zone>) => {
          if (page) {
            this.zones = page.content;
          }
        })
    );
  }
}
