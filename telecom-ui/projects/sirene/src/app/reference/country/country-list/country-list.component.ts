import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { Country, CountryFilter, CountryService, Delegation, DelegationService, MessageService, Page } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { CountryDialogComponent } from '../country-dialog/country-dialog.component';

export interface DialogData {
  mode: string;
  country: Country;
  message: string;
}

@Component({
  selector: 'stgo-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  countriesList: Country[] = [];
  totalElements: number;
  searchValue: string;
  displayedColumns: string[] = ['initials', 'name', 'rsm', 'sitesCount', 'delegation', 'actions'];
  panelFilterOpenState = true;
  delegations: Observable<Delegation[]>;
  advanceFilter: CountryFilter;
  filterCount = 0;

  private countryObj: Country;
  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private countrySubscription: Subscription;
  private listSubscription: Subscription;
  private sortSubscription: Subscription;
  private paginatorSubscription: Subscription;
  private sub$: Subscription = new Subscription();
  inputDelegation: Subject<string> = new Subject<string>();

  countryAdvanceFilterForm = this.fb.group({
    id: [''],
    name: [''],
    lastUser: [''],
    delegation: [''],
    showArchived: ['']
  });

  constructor(
    public dialog: MatDialog,
    private countryService: CountryService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private delegationService: DelegationService
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.resetAdvanceFilter();
    });

    this.delegations = this.inputDelegation.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.delegationService.getAllDelegations(query, null, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.countryAdvanceFilterForm.controls.delegation.setValue(null);

    this.sub$.add(this.filter$);
    this.sub$.add(this.countrySubscription);
    this.sub$.add(this.listSubscription);
    this.sub$.add(this.sortSubscription);
    this.sub$.add(this.paginatorSubscription);
  }

  ngAfterViewInit() {
    this.getAllCountries('name', 'asc');
    if (this.sort) {
      this.sortSubscription = this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginatorSubscription = this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  getAllCountries(sortField?: string, sortDirection?: SortDirection, search?: string, countryFilter?: CountryFilter) {
    this.isLoading = true;
    this.listSubscription = this.countryService
      .getAllCountries(search, this.pageIndex, this.pageSize, sortField, sortDirection, countryFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Country>) => {
        if (page) {
          this.countriesList = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }

  addCountry() {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { country: new Country(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue);
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

  editCountry(data: Country) {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { country: data, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  deleteCountry(data: Country) {
    this.countryObj = data;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.countryObj) {
        this.countryService.deleteCountry(this.countryObj.id).subscribe(obj => {
          this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
          this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue);
        });
      }
    });
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.searchValue = null;
    this.pageIndex = 0;
    this.advanceFilter = Object.assign(this.countryAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  countAdvanceFilter(countryFilter: CountryFilter): void {
    this.filterCount = 0;
    if (countryFilter) {
      if (countryFilter.id) {
        this.filterCount++;
      }
      if (countryFilter.name) {
        this.filterCount++;
      }
      if (countryFilter.lastUser) {
        this.filterCount++;
      }
      if (countryFilter.delegation) {
        this.filterCount++;
      }
      if (countryFilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.countryAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  recoverCountry(data: Country): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.countrySubscription = this.countryService
          .recoverCountry(data)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
              this.getAllCountries(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }
}
