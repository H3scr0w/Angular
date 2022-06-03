import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of } from 'rxjs/internal/observable/of';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { finalize } from 'rxjs/internal/operators/finalize';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Catalog } from '../../shared/models/catalog';
import { Page } from '../../shared/models/page.model';
import { CatalogService } from '../../shared/service/catalog/catalog.service';
import { CatalogVersion, CatalogVersionFilter } from './../../shared/models/catalog-version';
import { Operator } from './../../shared/models/operators';
import { OperatorsService } from './../../shared/service/operators/operators.service';

@Component({
  selector: 'stgo-catalog-export',
  templateUrl: './catalog-export.component.html',
  styleUrls: ['./catalog-export.component.scss']
})
export class CatalogExportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  catalogsVersions: CatalogVersion[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['filename', 'catalogVersion', 'sgnet', 'lastUpdate', 'actions'];
  panelFilterOpenState = false;
  advanceFilter: CatalogVersionFilter;
  operators: Observable<Operator[]>;
  catalogs: Observable<Catalog[]>;

  inputOperator: Subject<string> = new Subject<string>();
  inputCatalog: Subject<string> = new Subject<string>();

  catalogVersionAdvanceFilterForm = this.fb.group({
    operator: [null],
    catalog: [null],
    status: [''],
    sgnet: ['']
  });

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();

  constructor(
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private operatorService: OperatorsService
  ) {}

  ngOnInit() {
    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
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
        return this.catalogService.getAllCatalogs(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
  }

  ngAfterViewInit(): void {
    this.getAllCatalogVersions('id', 'desc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.catalogVersionAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.catalogVersionAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllCatalogVersions(this.sort.active, this.sort.direction, this.searchValue);
  }

  exportCatalog(catalogVersion: CatalogVersion): void {
    this.isLoading = true;
    const downloadVersion$ = this.catalogService
      .downloadCatalogVersion(catalogVersion.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((excelContent: Blob) => {
        if (excelContent) {
          const blob = new Blob([excelContent], { type: 'application/octet-stream' });
          saveAs(blob, catalogVersion.filename);
        }
      });

    this.sub$.add(downloadVersion$);
  }

  private countAdvanceFilter(catalogVersionFilter: CatalogVersionFilter): void {
    this.filterCount = 0;
    if (catalogVersionFilter) {
      if (catalogVersionFilter.sgnet) {
        this.filterCount++;
      }
      if (catalogVersionFilter.catalog) {
        this.filterCount++;
      }
      if (catalogVersionFilter.status) {
        this.filterCount++;
      }
      if (catalogVersionFilter.operator) {
        this.filterCount++;
      }
    }
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
            this.catalogsVersions = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
