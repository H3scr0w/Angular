import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { CompanyRequest } from '../../shared/models/company-request';
import { Contact } from '../../shared/models/contact';
import { CompanyRequestService } from '../../shared/services/company-request/company-request.service';
import { ContactService } from '../../shared/services/contact/contact.service';
import { RequestDialogData } from '../request-dialog-data';

@Component({
  selector: 'stgo-request-company-dialog',
  templateUrl: './request-company-dialog.component.html',
  styleUrls: ['./request-company-dialog.component.scss']
})
export class RequestCompanyDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  sectors: Observable<Sector[]>;
  zones: Zone[];
  isReadOnly: boolean;
  isVisible: boolean;
  isViewOnly: boolean;
  applicant: Contact;
  autoSector: Subject<string> = new Subject<string>();
  autoZone: Subject<string> = new Subject<string>();
  sitesCount = 0;
  usersCount = 0;
  rsmAttached: Contact;
  btnSaveText: string;
  companyForm = this.fb.group({
    id: [''],
    sifCode: [''],
    companyName: [''],
    comments: [''],
    sector: [''],
    zone: [''],
    requestType: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private companyRequestService: CompanyRequestService,
    private contactService: ContactService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RequestCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestDialogData
  ) {}

  ngOnInit() {
    this.sectors = this.autoSector.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.sectorService.getAllSectors(value, 0, 50).pipe(map(page => page.content));
      })
    );

    this.autoZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const selectedSector: Sector = this.companyForm.get('sector').value;
      const zoneFilter: ZoneFilter = new ZoneFilter();
      if (selectedSector && typeof selectedSector === 'object' && selectedSector.id) {
        zoneFilter.sector = selectedSector;
      }
      if (value) {
        zoneFilter.name = value;
      }
      this.getAllZones(zoneFilter);
    });

    this.isViewOnly = false;
    if (this.data) {
      this.isVisible = false;
      this.isViewOnly = this.data.viewOnly;
      if (this.data.action === 'M' || this.data.action === 'A' || this.data.mode === 'validate') {
        this.isReadOnly = true;
      } else {
        this.isReadOnly = false;
      }
      if (this.data.mode === 'request') {
        this.btnSaveText = 'request.Send';
        if (this.data.sifCode && this.isReadOnly) {
          this.getCompanyRequest(this.data.sifCode);
        } else {
          this.companyForm.setValue({
            companyName: '',
            sifCode: '',
            comments: '',
            sector: null,
            zone: null,
            requestType: this.data.action,
            id: 0
          });
        }
      } else if (this.data.mode === 'validate' && this.data.id) {
        this.btnSaveText = 'request.validate';
        this.getCompanyRequestForValidation(this.data.id);
      }
    }
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSectorSelected(): void {
    this.companyForm.get('zone').setValue(null);
    const zoneFilter: ZoneFilter = new ZoneFilter();
    zoneFilter.sector = this.companyForm.get('sector').value;
    this.getAllZones(zoneFilter);
  }

  onZoneSelected(): void {
    const selectedZone: Zone = this.companyForm.get('zone').value;
    this.companyForm.get('sector').setValue(selectedZone ? selectedZone.sector : null);
  }

  onSubmit(): void {
    if (this.companyForm.valid && this.data) {
      this.isLoading = true;
      const companyRequest: CompanyRequest = Object.assign({}, this.companyForm.value);
      if (this.data.mode === 'request' && companyRequest.sifCode) {
        this.sub$.add(
          this.companyRequestService
            .createCompanyRequest(companyRequest)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      } else if (this.data.mode === 'validate' && this.data.id !== 0) {
        this.sub$.add(
          this.companyRequestService
            .validateCompanyRequest(companyRequest)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
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

  hasError(controlName: string, errorName: string): boolean {
    if (controlName === 'sector') {
      const selectedSector: Sector = this.companyForm.controls[controlName].value;
      if (typeof selectedSector !== 'object') {
        this.companyForm.controls[controlName].setErrors({ required: true });
      }
    }
    if (controlName === 'zone') {
      const selectedZone: Zone = this.companyForm.controls[controlName].value;
      if (typeof selectedZone !== 'object') {
        this.companyForm.controls[controlName].setErrors({ required: true });
      }
    }
    return this.companyForm.controls[controlName].hasError(errorName);
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

  private getCompanyRequest(sifCode: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .getCompanyById(sifCode)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((company: Company) => {
          if (company && !company.archiveDate) {
            this.isVisible = true;
            this.companyForm.setValue({
              companyName: company.companyName ? company.companyName : '',
              sifCode: company.sifCode ? company.sifCode : '',
              comments: company.comments ? company.comments : '',
              sector: company.zone.sector ? company.zone.sector : null,
              zone: company.zone ? company.zone : null,
              requestType: this.data.action,
              id: 0
            });
            this.sitesCount = company.sitesCount;
            this.usersCount = company.usersCount;
            this.rsmAttached = company.rsmAttached;
          } else {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.notexist.message'), 'error');
          }
        })
    );
  }

  private getCompanyRequestForValidation(id: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyRequestService
        .getCompanyRequestById(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((companyRequest: CompanyRequest) => {
          if (companyRequest) {
            this.companyForm.setValue({
              companyName: companyRequest.companyName ? companyRequest.companyName : '',
              sifCode: companyRequest.sifCode ? companyRequest.sifCode : '',
              comments: companyRequest.comments ? companyRequest.comments : '',
              sector: companyRequest.zone.sector ? companyRequest.zone.sector : null,
              zone: companyRequest.zone ? companyRequest.zone : null,
              requestType: companyRequest.requestType,
              id: companyRequest.id
            });
            if (companyRequest.applicant) {
              this.isLoading = true;
              this.sub$.add(
                this.contactService
                  .getContactById(companyRequest.applicant)
                  .pipe(finalize(() => (this.isLoading = false)))
                  .subscribe((contact: Contact) => {
                    this.applicant = contact;
                  })
              );
            }
          } else {
            this.dialogRef.close();
            this.messageService.show(this.translateService.instant('common.save.notexist.message'), 'error');
          }
        })
    );
  }
}
