import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import {
  Company,
  CompanyFilter,
  CompanyService,
  MessageService,
  Page,
  Sector,
  SectorService,
  Zone,
  ZoneFilter,
  ZoneService
} from '../../../shared';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CompanyDialogComponent } from '../company-dialog/company-dialog.component';

@Component({
  selector: 'stgo-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  companies: Company[] = [];
  companiesAll: Company[] = [];
  sectors: Observable<Sector[]>;
  zones: Zone[];
  sifCodes: Observable<Company[]>;
  isLoading = false;
  isLoadingZone = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  panelFilterOpenState = true;
  advanceFilter: CompanyFilter;
  companyFilter: CompanyFilter = new CompanyFilter();
  filterCount = 0;
  isAdmin: boolean;
  isRsm: boolean;
  displayedColumns: string[] = [
    'companyName',
    'sifCode',
    'usersCount',
    'sitesCount',
    'lastSiteDate',
    'comments',
    'actions'
  ];

  inputSifCode: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputCRM: Subject<string> = new Subject<string>();
  private filter = new Subject<string>();
  private filter$: Subscription;
  private sub$: Subscription = new Subscription();

  companyAdvanceFilterForm = this.fb.group({
    sifCode: [''],
    companyName: [''],
    sector: [''],
    zone: [''],
    company: [''],
    showArchived: ['']
  });

  constructor(
    public dialog: MatDialog,
    private companyService: CompanyService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;

    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchValue: string) => {
      this.pageIndex = 0;
      this.searchValue = searchValue;
      this.resetAdvanceFilter();
    });

    this.companyAdvanceFilterForm.patchValue({
      sifCode: null,
      sector: null,
      zone: null,
      company: null
    });

    this.sub$.add(
      this.route.paramMap.subscribe(params => {
        if (params && params.has('sifCode')) {
          this.companyService.getCompanyById(params.get('sifCode')).subscribe(com => {
            this.editCompany(com);
          });
        }
      })
    );

    this.sifCodes = this.inputSifCode.pipe(
      startWith(''),
      filter(value => value && value.length > 3),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const companyFilter: CompanyFilter = new CompanyFilter();
        companyFilter.sifCode = value;
        companyFilter.skip = true;
        return this.companyService.getAllCompanies('', 0, 10, '', 'asc', companyFilter).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

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
      const selectedSector: Sector = this.companyAdvanceFilterForm.get('sector').value;
      const zoneFilter: ZoneFilter = new ZoneFilter();
      if (selectedSector && typeof selectedSector === 'object' && selectedSector.id) {
        zoneFilter.sector = selectedSector;
      }
      if (value) {
        zoneFilter.name = value;
      }
      this.getAllZones(zoneFilter);
    });

    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.companyFilter = new CompanyFilter();
      const selectedZone: Zone = this.companyAdvanceFilterForm.get('zone').value;
      const selectedSector: Sector = this.companyAdvanceFilterForm.get('sector').value;
      if (selectedSector && selectedSector.id) {
        this.companyFilter.sector = selectedSector;
      }
      if (selectedZone && selectedZone.id) {
        this.companyFilter.zone = selectedZone;
      }
      if (value) {
        this.companyFilter.companyName = value;
      }
      this.getAllCompaniesForFilter(this.companyFilter);
    });

    this.companyAdvanceFilterForm.controls.sector.setValue(null);
    this.companyAdvanceFilterForm.controls.zone.setValue(null);
    this.companyAdvanceFilterForm.controls.company.setValue(null);

    this.sub$.add(
      this.companyAdvanceFilterForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(val => {
        if (val && !val.sifCode && !val.companyName) {
          this.companyAdvanceFilterForm.controls.company.setValue(null);
        }
      })
    );

    this.sub$.add(this.filter$);
  }

  ngAfterViewInit() {
    this.getAllCompanies('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSifSelected(company: Company): void {
    if (company && company.sifCode) {
      this.companyAdvanceFilterForm.patchValue({
        sector: company.zone.sector,
        zone: company.zone,
        company
      });
    }
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.companyAdvanceFilterForm.patchValue({
        sector: zone.sector,
        company: null
      });
      this.companyFilter.zone = zone;
    } else {
      this.companyFilter.zone = null;
    }
    this.getAllCompaniesForFilter(this.companyFilter);
  }

  onCompanySelected(company: Company): void {
    if (company && company.sifCode) {
      this.companyAdvanceFilterForm.patchValue({
        sifCode: company.sifCode,
        companyName: company.companyName,
        sector: company.zone.sector,
        zone: company.zone
      });
    }
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.companyAdvanceFilterForm.get('zone').setValue(null);
      const zoneFilter: ZoneFilter = new ZoneFilter();
      zoneFilter.sector = sector;
      this.companyFilter.sector = sector;
      this.companyFilter.zone = null;
      this.getAllZones(zoneFilter);
    } else {
      this.companyFilter.sector = null;
    }
    this.getAllCompaniesForFilter(this.companyFilter);
  }

  onSifCodeInput(input: string) {
    this.companyAdvanceFilterForm.get('sifCode').setValue(input.toUpperCase());
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  applyAdvanceFilter(): void {
    this.searchValue = null;
    this.pageIndex = 0;
    this.advanceFilter = Object.assign(this.companyAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  countAdvanceFilter(companyFilter: CompanyFilter): void {
    this.filterCount = 0;
    if (companyFilter) {
      if (companyFilter.sifCode) {
        this.filterCount++;
      }
      if (companyFilter.companyName) {
        this.filterCount++;
      }
      if (companyFilter.sector) {
        this.filterCount++;
      }
      if (companyFilter.zone) {
        this.filterCount++;
      }
      if (companyFilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.companyAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.companyFilter = new CompanyFilter();
    this.countAdvanceFilter(null);
    this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
    this.getAllCompaniesForFilter(this.companyFilter);
  }

  addCompany(): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      data: { company: new Company(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editCompany(data: Company): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      data: { company: data, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  viewCompany(data: Company): void {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      data: { company: data, mode: 'view' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteCompany(data: Company): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.companyService
            .deleteCompany(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
                this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            })
        );
      }
    });
  }

  recoverCompany(data: Company): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.companyService
            .recoverCompany(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
                this.getAllCompanies(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            })
        );
      }
    });
  }

  exportExcel(): void {
    this.isLoading = true;
    this.sub$.add(
      this.companyService
        .exportExcel(
          this.searchValue,
          this.pageIndex,
          this.pageSize,
          this.sort.active,
          this.sort.direction,
          this.advanceFilter
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((excelContent: Blob) => {
          if (excelContent) {
            const blob = new Blob([excelContent], { type: 'application/octet-stream' });
            saveAs(blob, 'CompanyReport.xlsx');
          }
        })
    );
  }

  private getAllCompanies(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    companyFilter?: CompanyFilter
  ): void {
    this.isLoading = true;
    if (!companyFilter) {
      companyFilter = new CompanyFilter();
    }
    this.sub$.add(
      this.companyService
        .getAllCompanies(search, this.pageIndex, this.pageSize, sortField, sortDirection, companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companies = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
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

  private getAllCompaniesForFilter(companyFilter?: CompanyFilter): void {
    this.isLoading = true;
    this.companyFilter.skip = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies('', 0, 50, 'companyName', 'asc', companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companiesAll = page.content.sort((a, b) => a.companyName.localeCompare(b.companyName));
          }
        })
    );
  }
}
