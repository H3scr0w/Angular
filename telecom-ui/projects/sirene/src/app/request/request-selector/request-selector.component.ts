import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Company, CompanyFilter, CompanyService, Site, SiteFilter, SiteService } from '@shared';
import { of, Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/internal/operators/finalize';
import { debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs/operators';
import { DropDownType, RequestActionType } from '../../shared/models/dropdown-type';
import { RequestSelectorService } from '../../shared/services/request-selector/request-selector.service';
import { RequestCompanyDialogComponent } from '../request-company-dialog/request-company-dialog.component';
import { RequestSiteCreateDialogComponent } from '../request-site-create-dialog/request-site-create-dialog.component';
import { RequestSiteModifyDialogComponent } from '../request-site-modify-dialog/request-site-modify-dialog.component';

@Component({
  selector: 'stgo-request-selector',
  templateUrl: './request-selector.component.html',
  styleUrls: ['./request-selector.component.scss']
})
export class RequestSelectorComponent implements OnInit {
  types: DropDownType[];
  actions: DropDownType[];
  sifCodes: Observable<Company[]>;
  siteCodes: Observable<Site[]>;
  sifCodesDelete: Observable<Company[]>;
  siteCodesDelete: Observable<Site[]>;
  company: Company;
  site: Site;

  requestSelectorForm = this.fb.group({
    type: ['', Validators.required],
    action: ['', Validators.required],
    sifCode: [''],
    siteCode: ['']
  });

  showSifCode: boolean;
  showSiteCode: boolean;
  showSifCodeDelete: boolean;
  showSiteCodeDelete: boolean;
  isLoading: boolean;

  autoSifCodes: Subject<string> = new Subject<string>();
  autoSiteCodes: Subject<string> = new Subject<string>();
  autoSifCodesDelete: Subject<string> = new Subject<string>();
  autoSiteCodesDelete: Subject<string> = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private requestSelectorService: RequestSelectorService,
    private companyService: CompanyService,
    private siteService: SiteService
  ) {}

  ngOnInit() {
    this.types = this.requestSelectorService.getRequestType();
    this.actions = this.requestSelectorService.getRequestActions();

    this.requestSelectorForm.get('type').valueChanges.subscribe((type: string) => {
      this.showSifCodeORSiteCodeControl(this.requestSelectorForm.value.action, type);
    });

    this.requestSelectorForm.get('action').valueChanges.subscribe((mode: string) => {
      this.showSifCodeORSiteCodeControl(mode, this.requestSelectorForm.value.type);
    });

    this.sifCodes = this.autoSifCodes.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.companyService.getAllCompanies(value, 0, 50).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.sifCodesDelete = this.autoSifCodesDelete.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const filter = new CompanyFilter();
        filter.sifCode = value;
        filter.showArchived = false;
        filter.withoutSites = true;
        this.isLoading = true;
        return this.companyService.getAllCompanies(null, 0, 50, null, null, filter).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.siteCodes = this.autoSiteCodes.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.siteService.getAllSites(0, 500, 'siteCode', 'asc', value).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.siteCodesDelete = this.autoSiteCodesDelete.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const filter = new SiteFilter();
        filter.usualName = value;
        filter.showArchived = false;
        filter.withoutDevices = true;
        filter.withoutUsers = true;
        this.isLoading = true;
        return this.siteService.getAllSites(0, 500, 'siteCode', 'asc', null, filter).pipe(
          finalize(() => (this.isLoading = false)),
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );
  }

  request(): void {
    if (this.requestSelectorForm.value.type === 'company') {
      this.getRequestCompanyDialog();
    } else if (this.requestSelectorForm.value.type === 'site') {
      this.getRequestSiteDialog();
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.requestSelectorForm.controls[controlName].hasError(errorName);
  }

  onSifSelected(company: Company): void {
    if (company && company.sifCode) {
      this.company = company;
    } else {
      this.company = null;
    }
  }

  onsiteCodesSelected(site: Site): void {
    if (site && site.siteCode) {
      this.site = site;
    } else {
      this.site = null;
    }
  }

  private getRequestCompanyDialog(): void {
    this.dialog
      .open(RequestCompanyDialogComponent, {
        width: '800px',
        disableClose: true,
        data: {
          sifCode: !this.requestSelectorForm.value.sifCode ? null : this.requestSelectorForm.value.sifCode,
          action: this.requestSelectorForm.value.action,
          mode: 'request'
        }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.resetForm();
        }
      });
  }

  private getRequestSiteDialog(): void {
    if (this.requestSelectorForm.value.action === RequestActionType.Creation) {
      this.dialog
        .open(RequestSiteCreateDialogComponent, {
          width: '800px',
          data: { mode: 'creation' },
          disableClose: true
        })
        .afterClosed()
        .subscribe(result => {
          if (result !== 'close') {
            this.resetForm();
          }
        });
    } else {
      this.dialog
        .open(RequestSiteModifyDialogComponent, {
          width: '800px',
          disableClose: true,
          data: {
            siteCode: !this.requestSelectorForm.value.siteCode ? null : this.requestSelectorForm.value.siteCode,
            action: this.requestSelectorForm.value.action,
            mode: 'request'
          }
        })
        .afterClosed()
        .subscribe(result => {
          if (result !== 'close') {
            this.resetForm();
          }
        });
    }
  }

  private resetForm(): void {
    this.requestSelectorForm.reset();
    this.requestSelectorForm.setValue({
      type: ['', Validators.required],
      action: ['', Validators.required],
      sifCode: [''],
      siteCode: ['']
    });
    this.requestSelectorForm.setErrors({ invalid: true });
  }

  private showSifCodeORSiteCodeControl(mode: string, type: string): void {
    this.showSifCode = false;
    this.showSifCodeDelete = false;
    this.showSiteCode = false;
    this.showSiteCodeDelete = false;
    const sifCodeControl = this.requestSelectorForm.get('sifCode');
    const siteCodeControl = this.requestSelectorForm.get('siteCode');
    // reset sif and site codes
    sifCodeControl.reset();
    siteCodeControl.reset();
    this.company = null;
    this.site = null;
    if (mode === RequestActionType.Modification || mode === RequestActionType.Deletion) {
      if (type === 'company') {
        if (mode === RequestActionType.Modification) {
          this.showSifCode = true;
        } else {
          this.showSifCodeDelete = true;
        }
        sifCodeControl.setValidators([Validators.required]);
        siteCodeControl.clearValidators();
      } else if (type === 'site') {
        if (mode === RequestActionType.Modification) {
          this.showSiteCode = true;
        } else {
          this.showSiteCodeDelete = true;
        }
        siteCodeControl.setValidators([Validators.required]);
        sifCodeControl.clearValidators();
      }
    } else {
      sifCodeControl.clearValidators();
      siteCodeControl.clearValidators();
    }
    sifCodeControl.updateValueAndValidity();
    siteCodeControl.updateValueAndValidity();
  }
}
