import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { Company, CompanyFilter, CompanyService, Page, Site, SiteFilter, SiteService } from '../../../shared';
import { Contact } from '../../../shared/models/contact';
import { BulkSiteDialogComponent } from '../bulk-site-dialog/bulk-site-dialog.component';

@Component({
  selector: 'stgo-bulk-site-list',
  templateUrl: './bulk-site-list.component.html',
  styleUrls: ['./bulk-site-list.component.scss']
})
export class BulkSiteListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  sites: Site[] = [];
  companies: Company[];
  rsms: Contact[] = [];
  sifCodes: Observable<Company[]>;
  pageIndex = 0;
  pageSize = 10;
  advanceFilter: SiteFilter;
  companyFilter: CompanyFilter = new CompanyFilter();
  isLoading = false;
  isRsmLoading = false;
  filterCount = 0;
  searchValue: string;
  totalElements: number;
  displayedColumns: string[] = ['select', 'usualName', 'company', 'rsm'];
  panelFilterOpenState = true;
  isAdmin: boolean;
  selection = new SelectionModel<Site>(true, []);

  bulkSiteAdvanceFilterForm = this.fb.group({
    sifCode: [''],
    company: [''],
    rsm: ['']
  });

  inputSifCode: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private companyService: CompanyService,
    private siteService: SiteService
  ) {}

  private filter: Subject<string> = new Subject();
  private sub$: Subscription = new Subscription();

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
        this.pageIndex = 0;
        this.searchValue = searchTextValue;
        this.resetAdvanceFilter();
      })
    );

    this.sifCodes = this.inputSifCode.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.companyService.getAllCompanies(value, 0, 50).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.sifCode.localeCompare(b.sifCode)));
          })
        );
      })
    );

    this.getAllRSM();

    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.companyFilter = new CompanyFilter();
      this.companyFilter.companyName = value;
      this.getAllCompanies(this.companyFilter);
    });

    this.bulkSiteAdvanceFilterForm.patchValue({
      sifCode: null,
      company: null,
      rsm: null
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onSifSelected(company: Company): void {
    if (company) {
      this.bulkSiteAdvanceFilterForm.get('company').setValue(company);
    } else {
      this.bulkSiteAdvanceFilterForm.get('company').setValue(null);
    }
  }

  onCompanySelected(company: Company): void {
    if (company) {
      this.bulkSiteAdvanceFilterForm.get('sifCode').setValue(company);
    } else {
      this.bulkSiteAdvanceFilterForm.get('sifCode').setValue(null);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.sites != null ? this.sites.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.sites.forEach(row => this.selection.select(row));
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  editBulkSite(): void {
    const siteCodes: string[] = this.selection.selected.map(site => site.siteCode);
    const dialogRef = this.dialog.open(BulkSiteDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', site: siteCodes }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
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
    const siteFilter: SiteFilter = new SiteFilter();
    if (this.bulkSiteAdvanceFilterForm.value) {
      (siteFilter.sifCode =
        this.bulkSiteAdvanceFilterForm.controls.sifCode.value != null
          ? this.bulkSiteAdvanceFilterForm.controls.sifCode.value
          : null),
        (siteFilter.company =
          this.bulkSiteAdvanceFilterForm.controls.company.value != null
            ? this.bulkSiteAdvanceFilterForm.controls.company.value
            : null),
        (siteFilter.rsm =
          this.bulkSiteAdvanceFilterForm.controls.rsm != null
            ? this.bulkSiteAdvanceFilterForm.controls.rsm.value
            : null),
        (siteFilter.backbone = null);
    }
    this.advanceFilter = siteFilter;
    this.searchValue = null;
    this.selection.clear();
    this.pageIndex = 0;
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  countAdvanceFilter(siteFilter: SiteFilter): void {
    this.filterCount = 0;
    if (siteFilter) {
      if (siteFilter.sifCode) {
        this.filterCount++;
      }
      if (siteFilter.company) {
        this.filterCount++;
      }
      if (siteFilter.rsm) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilter = null;
    this.sites = [];
    this.selection.clear();
    this.bulkSiteAdvanceFilterForm.reset();
    this.countAdvanceFilter(null);
    this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private getAllCompanies(companyFilter?: CompanyFilter): void {
    this.isLoading = true;
    this.companyFilter.skip = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies('', 0, 50, 'name', 'asc', companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companies = page.content.sort((a, b) => a.companyName.localeCompare(b.companyName));
          }
        })
    );
  }

  private getAllRSM(): void {
    this.isRsmLoading = true;
    this.sub$.add(
      this.siteService
        .getActiveRSMs()
        .pipe(finalize(() => (this.isRsmLoading = false)))
        .subscribe((page: Page<Contact>) => {
          if (page) {
            this.rsms = page.content.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
        })
    );
  }

  private getAllSites(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): void {
    this.isLoading = true;
    this.selection.clear();
    this.sub$.add(
      this.siteService
        .getAllSites(this.pageIndex, this.pageSize, sortField, sortDirection, search, siteFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Site>) => {
          if (page) {
            this.sites = page.content;
            this.sites.map(site => {
              return this.rsms.forEach(rsm => {
                if (site.rsmId === rsm.id) {
                  site.rsm = rsm;
                }
              });
            });
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
