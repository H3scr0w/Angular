import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import {
  City,
  CityFilter,
  CityService,
  Company,
  CompanyFilter,
  CompanyService,
  Country,
  CountryFilter,
  CountryService,
  MessageService,
  Page,
  Sector,
  SectorService,
  Site,
  SiteBackbone,
  SiteFilter,
  SiteService,
  Zone,
  ZoneFilter,
  ZoneService
} from '../../../shared';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Contact, ContactFilter } from '../../../shared/models/contact';
import { Profile } from '../../../shared/models/profile';
import { SiteDialogComponent } from '../site-dialog/site-dialog.component';

@Component({
  selector: 'stgo-site-list',
  templateUrl: './site-list.component.html',
  styleUrls: ['./site-list.component.scss']
})
export class SiteListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  sites: Site[] = [];
  isLoading = false;
  isSitesLoading = false;
  isRsmLoading = false;
  totalElements: number;
  searchValue: string;
  displayedColumns: string[] = ['usualName', 'address1', 'sector', 'company', 'sifCode', 'actions'];
  pageIndex = 0;
  pageSize = 10;
  panelFilterOpenState = true;
  filterCount = 0;
  advanceFilter: SiteFilter;
  rsms: Observable<Contact[]>;
  sifCodes: Observable<Company[]>;
  sectors: Observable<Sector[]>;
  zones: Zone[];
  companies: Company[];
  countries: Observable<Country[]>;
  countryFilter: CountryFilter;
  cities: City[];
  selectedCity: City;
  companyFilter: CompanyFilter = new CompanyFilter();
  backbones: SiteBackbone[] = [
    { id: 1, name: 'Only' },
    { id: 0, name: 'Excluded' }
  ];
  isAdmin: boolean;
  isRsm: boolean;

  inputSifCode: Subject<string> = new Subject<string>();
  inputSector: Subject<string> = new Subject<string>();
  inputZone: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();
  inputCountry: Subject<string> = new Subject<string>();
  inputCity: Subject<string> = new Subject<string>();
  inputRsm: Subject<string> = new Subject<string>();

  siteAdvanceFilterForm = this.fb.group({
    usualName: [''],
    siteCodeChar: [''],
    siteCodeFrom: [''],
    siteCodeTo: [''],
    country: [''],
    city: [''],
    sector: [''],
    zone: [''],
    company: [''],
    showArchived: false,
    sifCode: [''],
    backbone: [''],
    rsm: ['']
  });

  private filter: Subject<string> = new Subject();
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private siteService: SiteService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private sectorService: SectorService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private countryService: CountryService,
    private cityService: CityService,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;

    this.sub$.add(
      this.route.paramMap.subscribe(params => {
        if (params && params.has('siteCode')) {
          this.editSite(params.get('siteCode'));
        }
      })
    );

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
        this.pageIndex = 0;
        this.searchValue = searchTextValue;
        this.resetAdvanceFilter();
      })
    );

    this.siteAdvanceFilterForm.patchValue({
      sifCode: null,
      sector: null,
      zone: null,
      company: null,
      country: null,
      city: null,
      rsm: null,
      backbone: null
    });

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

    this.sifCodes = this.inputSifCode.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.companyService.getAllCompanies(value, 0, 50).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.inputZone.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      const selectedSector: Sector = this.siteAdvanceFilterForm.get('sector').value;
      const zoneFilter: ZoneFilter = new ZoneFilter();
      if (selectedSector && typeof selectedSector === 'object' && selectedSector.id) {
        zoneFilter.sector = selectedSector;
      }
      zoneFilter.name = value;
      this.getAllZones(zoneFilter);
    });

    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.companyFilter = new CompanyFilter();
      const selectedZone: Zone = this.siteAdvanceFilterForm.get('zone').value;
      const selectedSector: Sector = this.siteAdvanceFilterForm.get('sector').value;
      if (selectedSector && selectedSector.id) {
        this.companyFilter.sector = selectedSector;
      }
      if (selectedZone && selectedZone.id) {
        this.companyFilter.zone = selectedZone;
      }
      this.companyFilter.companyName = value;

      this.getAllCompanies(this.companyFilter);
    });

    this.countries = this.inputCountry.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.countryFilter = new CountryFilter();
        this.countryFilter.name = value;
        this.countryFilter.skip = true;
        return this.countryService.getAllCountries(null, 0, 200, 'name', 'asc', this.countryFilter).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
          })
        );
      })
    );

    this.inputCity.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe((value: string) => {
      const selectedCountry: Country = this.siteAdvanceFilterForm.get('country').value;
      const cityFilter: CityFilter = new CityFilter();
      if (selectedCountry && typeof selectedCountry === 'object' && selectedCountry.id) {
        cityFilter.country = selectedCountry;
      }
      cityFilter.name = value;

      this.getAllCities(cityFilter);
    });

    this.rsms = this.inputRsm.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isRsmLoading = true;
        const contactFilter: ContactFilter = new ContactFilter();
        const profile: Profile = new Profile();
        profile.name = environment.rsmProfileName;
        contactFilter.profile = profile;
        return this.siteService.getActiveRSMs().pipe(
          finalize(() => (this.isRsmLoading = false)),
          switchMap(result => {
            return of(result.content.sort((a, b) => a.fullName.localeCompare(b.fullName)));
          })
        );
      })
    );
  }

  ngAfterViewInit() {
    this.getAllSites('siteCode', 'asc');
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
    this.advanceFilter = Object.assign(this.siteAdvanceFilterForm.value);
    this.searchValue = null;
    this.pageIndex = 0;
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  countAdvanceFilter(siteFilter: SiteFilter): void {
    this.filterCount = 0;
    if (siteFilter) {
      if (siteFilter.showArchived) {
        this.filterCount++;
      }
      if (siteFilter.usualName) {
        this.filterCount++;
      }
      if (siteFilter.siteCodeTo) {
        this.filterCount++;
      }
      if (siteFilter.sector) {
        this.filterCount++;
      }
      if (siteFilter.zone) {
        this.filterCount++;
      }
      if (siteFilter.company) {
        this.filterCount++;
      }
      if (siteFilter.sifCode) {
        this.filterCount++;
      }
      if (siteFilter.country) {
        this.filterCount++;
      }
      if (siteFilter.city) {
        this.filterCount++;
      }
      if (siteFilter.rsm) {
        this.filterCount++;
      }
      if (siteFilter.backbone && siteFilter.backbone >= 0) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.siteAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.companyFilter = new CompanyFilter();
    this.countAdvanceFilter(null);
    this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  addSite(): void {
    const dialogRef = this.dialog.open(SiteDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      autoFocus: true,
      data: { site: new Site(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editSite(siteCode: string): void {
    const dialogRef = this.dialog.open(SiteDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      autoFocus: true,
      data: { site: siteCode, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  viewSite(siteCode: string): void {
    const dialogRef = this.dialog.open(SiteDialogComponent, {
      width: '800px',
      disableClose: true,
      hasBackdrop: false,
      autoFocus: true,
      data: { site: siteCode, mode: 'view' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteSite(data: Site): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
        this.sub$.add(
          this.siteService.deleteSite(data.siteCode).subscribe(site => {
            this.sites = this.sites.filter(s => s.siteCode !== data.siteCode);
          })
        );
      }
    });
  }

  recoverSite(data: Site): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.sub$.add(
          this.siteService
            .recoverSite(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
                this.getAllSites(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
                this.cdRef.detectChanges();
              }
            })
        );
      }
    });
  }

  exportExcel(): void {
    this.isLoading = true;
    this.sub$.add(
      this.siteService
        .exportExcelSite(
          this.pageIndex,
          this.pageSize,
          this.sort.active,
          this.sort.direction,
          this.searchValue,
          this.advanceFilter
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((excelContent: Blob) => {
          if (excelContent) {
            const blob = new Blob([excelContent], { type: 'application/octet-stream' });
            saveAs(blob, 'SitesReport-' + this.datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss') + '.xlsx');
          }
        })
    );
  }

  onSifSelected(company: Company): void {
    if (company && company.sifCode) {
      this.siteAdvanceFilterForm.patchValue({
        sector: company.zone.sector,
        zone: company.zone,
        company
      });
    }
  }

  onZoneSelected(zone: Zone): void {
    if (zone) {
      this.siteAdvanceFilterForm.patchValue({
        sector: zone.sector,
        sifCode: null,
        company: null
      });
      this.companyFilter.zone = zone;
    } else {
      this.companyFilter.zone = null;
    }
    this.getAllCompanies(this.companyFilter);
  }

  onCompanySelected(company: Company): void {
    if (company && company.sifCode) {
      this.siteAdvanceFilterForm.patchValue({
        sifCode: company,
        sector: company.zone.sector,
        zone: company.zone
      });
    }
  }

  onSectorSelected(sector: Sector): void {
    if (sector) {
      this.siteAdvanceFilterForm.get('zone').setValue(null);
      this.siteAdvanceFilterForm.get('company').setValue(null);
      this.siteAdvanceFilterForm.get('sifCode').setValue(null);

      const zoneFilter: ZoneFilter = new ZoneFilter();
      zoneFilter.sector = sector;
      this.companyFilter.sector = sector;
      this.companyFilter.zone = null;
      this.getAllZones(zoneFilter);
    } else {
      this.companyFilter.sector = null;
    }
    this.getAllCompanies(this.companyFilter);
  }

  onCountrySelected(country: Country): void {
    if (country) {
      this.siteAdvanceFilterForm.patchValue({
        postCode: country.id + '-',
        city: null
      });
      const cityFilter: CityFilter = new CityFilter();
      if (country && country.id) {
        cityFilter.country = country;
      }
      this.getAllCities(cityFilter);
    }
  }

  onCitySelected(city: City): void {
    if (city) {
      this.siteAdvanceFilterForm.get('country').setValue(city.country);
    }
  }

  private getAllSites(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    siteFilter?: SiteFilter
  ): void {
    this.isSitesLoading = true;
    this.sub$.add(
      this.siteService
        .getAllSites(this.pageIndex, this.pageSize, sortField, sortDirection, search, siteFilter)
        .pipe(finalize(() => (this.isSitesLoading = false)))
        .subscribe((page: Page<Site>) => {
          if (page) {
            this.sites = page.content;
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

  private getAllCities(cityFilter?: CityFilter): void {
    this.isLoading = true;
    cityFilter.skip = true;
    this.sub$.add(
      this.cityService
        .getAllCities(0, 50, 'name', 'asc', '', cityFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<City>) => {
          if (page) {
            this.cities = page.content.sort((a, b) => a.name.localeCompare(b.name));
          }
        })
    );
  }
}
