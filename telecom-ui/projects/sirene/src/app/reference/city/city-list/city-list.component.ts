import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { City, CityFilter, CityService, Country, CountryFilter, CountryService, MessageService, Page } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CityDialogComponent } from '../city-dialog/city-dialog.component';

@Component({
  selector: 'stgo-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  cities: City[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  advanceFilter: CityFilter;
  panelFilterOpenState = true;
  countries: Observable<Country[]>;
  displayedColumns: string[] = ['name', 'country', 'actions'];

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private citySubscription: Subscription;
  private sub$: Subscription = new Subscription();
  inputCountry: Subject<string> = new Subject<string>();

  cityAdvanceFilterForm = this.fb.group({
    name: [''],
    country: [''],
    showArchived: ['']
  });

  constructor(
    public dialog: MatDialog,
    private cityService: CityService,
    private countryService: CountryService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.resetAdvanceFilter();
    });

    this.countries = this.inputCountry.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        const countryFilter: CountryFilter = new CountryFilter();
        if (value) {
          countryFilter.name = value;
        }
        return this.countryService.getAllCountries('', 0, 200, 'name', 'asc', countryFilter).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.cityAdvanceFilterForm.controls.country.setValue(null);
    this.sub$.add(this.filter$);
    this.sub$.add(this.citySubscription);
  }

  ngAfterViewInit() {
    this.getAllCities('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addCity(): void {
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { city: new City(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editCity(data: City): void {
    const dialogRef = this.dialog.open(CityDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { city: data, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteCity(data: City): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.citySubscription = this.cityService
          .deleteCity(data.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
              this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  recoverCity(data: City): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.citySubscription = this.cityService
          .recoverCity(data)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
              this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  getCountryName(country?: Country): string | undefined {
    return country ? country.name : undefined;
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
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.cityAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.cityAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.getAllCities(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(cityfilter: CityFilter): void {
    this.filterCount = 0;
    if (cityfilter) {
      if (cityfilter.name) {
        this.filterCount++;
      }
      if (cityfilter.country) {
        this.filterCount++;
      }
      if (cityfilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  private getAllCities(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    cityFilter?: CityFilter
  ): void {
    this.isLoading = true;
    this.citySubscription = this.cityService
      .getAllCities(this.pageIndex, this.pageSize, sortField, sortDirection, search, cityFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<City>) => {
        if (page) {
          this.cities = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }
}
