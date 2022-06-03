import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Page } from '../../../../../sirene/src/app/shared';
import { AuthenticationService } from '../../core';
import { Catalog } from '../../shared/models/catalog';
import { CatalogVersion, CatalogVersionFilter } from '../../shared/models/catalog-version';
import { Operator } from '../../shared/models/operators';
import { CatalogService } from '../../shared/service/catalog/catalog.service';
import { MessageService } from '../../shared/service/message/message.service';
import { OperatorsService } from '../../shared/service/operators/operators.service';

@Component({
  selector: 'stgo-catalog-activate',
  templateUrl: './catalog-activate.component.html',
  styleUrls: ['./catalog-activate.component.scss']
})
export class CatalogActivateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  searchValue: string;
  operators: Observable<Operator[]>;
  catalogs: Observable<Catalog[]>;
  catalogVersions: CatalogVersion[];
  catalogsStatus: any[] = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false }
  ];
  panelFilterOpenState = false;
  catalogVersionFilter: CatalogVersionFilter;
  filterCount = 0;
  isAdmin: boolean;
  isPmUser: boolean;
  inputOperator: Subject<string> = new Subject<string>();
  inputCatalog: Subject<string> = new Subject<string>();
  private sub$: Subscription = new Subscription();
  private filter$: Subscription;
  private filter = new Subject<string>();

  displayedColumns: string[] = ['operator', 'name', 'catalogVersion', 'actions'];

  activateCatalogAdvanceFilterForm = this.fb.group({
    operator: [''],
    status: [''],
    catalog: ['']
  });

  constructor(
    private fb: FormBuilder,
    private operatorService: OperatorsService,
    private catalogService: CatalogService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isPmUser = this.authenticationService.credentials.isPmUser;

    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchValue: string) => {
      this.pageIndex = 0;
      this.searchValue = searchValue;
      this.resetAdvanceFilter();
    });

    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorService.getAllOperators(0, 200, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.catalogs = this.inputCatalog.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.catalogService.getAllCatalogs(0, 200, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.activateCatalogAdvanceFilterForm.controls.operator.setValue(null);
    this.activateCatalogAdvanceFilterForm.controls.status.setValue(null);
    this.activateCatalogAdvanceFilterForm.controls.catalog.setValue(null);
    this.sub$.add(this.filter$);
  }

  ngAfterViewInit() {
    this.getAllCatalogVersions('catalog.name', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.catalogVersionFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.catalogVersionFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
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
    this.catalogVersionFilter = Object.assign(this.activateCatalogAdvanceFilterForm.value);
    this.countAdvanceFilter(this.catalogVersionFilter);
    this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.catalogVersionFilter);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  countAdvanceFilter(catalogVersionFilter: CatalogVersionFilter): void {
    this.filterCount = 0;
    if (catalogVersionFilter) {
      if (catalogVersionFilter.operator) {
        this.filterCount++;
      }
      if (catalogVersionFilter.status || catalogVersionFilter.status === false) {
        this.filterCount++;
      }
      if (catalogVersionFilter.catalog) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.activateCatalogAdvanceFilterForm.reset();
    this.catalogVersionFilter = null;
    this.countAdvanceFilter(null);
    this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue);
  }

  toggleCatalogStatus(id: number): void {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .changeCatalogVersionStatus(id)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(res => {
          if (res) {
            this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            this.getAllCatalogVersions(
              this.sort.active,
              this.sort.direction,
              this.searchValue,
              this.catalogVersionFilter
            );
          }
        })
    );
  }

  private getAllCatalogVersions(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    catalogVersionFilter?: CatalogVersionFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.catalogService
        .getAllCatalogVersions(this.pageIndex, this.pageSize, sortField, sortDirection, search, catalogVersionFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CatalogVersion>) => {
          if (page) {
            this.catalogVersions = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
