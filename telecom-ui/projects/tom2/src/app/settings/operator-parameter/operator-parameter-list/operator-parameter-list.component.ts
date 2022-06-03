import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { OperatorParameter, OperatorParameterDTO } from '../../../shared/models/operator-parameter';
import { Operator } from '../../../shared/models/operators';
import { Page } from '../../../shared/models/page.model';
import { OperatorParameterService } from '../../../shared/service/operatorparameter/operator-parameter.service';
import { OperatorsService } from '../../../shared/service/operators/operators.service';
import { OperatorParameterDialogComponent } from '../operator-parameter-dialog/operator-parameter-dialog.component';

@Component({
  selector: 'stgo-operator-parameter-list',
  templateUrl: './operator-parameter-list.component.html',
  styleUrls: ['./operator-parameter-list.component.css']
})
export class OperatorParameterListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  operatorParameters: OperatorParameterDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['operator', 'label', 'actions'];
  isAdmin: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: OperatorParameterDTO;
  operators: Observable<Operator[]>;

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputOperator: Subject<string> = new Subject<string>();

  operatorParameterAdvanceFilterForm = this.fb.group({
    operator: [null, Validators.required],
    type: ['O', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private operatorsService: OperatorsService,
    private operatorParameterService: OperatorParameterService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.operators = this.inputOperator.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.operatorsService.getAllOperators(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.name.localeCompare(b.name)));
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

  ngAfterViewInit() {
    this.getAllOperatorParameters('label', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }
  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addOperatorParameter(): void {
    const dialogRef = this.dialog.open(OperatorParameterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', operatorParameter: new OperatorParameter() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editOperatorParameter(data: OperatorParameter): void {
    const dialogRef = this.dialog.open(OperatorParameterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', operatorParameter: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
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
    this.advanceFilter = Object.assign({}, this.operatorParameterAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.operatorParameterAdvanceFilterForm.reset();
    this.operatorParameterAdvanceFilterForm.controls.type.setValue('O');
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllOperatorParameters(this.sort.active, this.sort.direction, this.searchValue);
  }

  private countAdvanceFilter(operatorParameterFilter: OperatorParameterDTO): void {
    this.filterCount = 0;
    if (operatorParameterFilter) {
      if (operatorParameterFilter.type) {
        this.filterCount++;
      }
      if (operatorParameterFilter.operator) {
        this.filterCount++;
      }
    }
  }

  private getAllOperatorParameters(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    operatorParameterFilter?: OperatorParameterDTO
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.operatorParameterService
        .getAllOperatorParameters(
          this.pageIndex,
          this.pageSize,
          sortField,
          sortDirection,
          search,
          operatorParameterFilter
        )
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<OperatorParameterDTO>) => {
          if (page) {
            this.operatorParameters = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
