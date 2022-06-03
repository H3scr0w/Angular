import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../../../core';
import { AcnParameter, AcnParameterDTO } from '../../../shared/models/acn-parameter';
import { Networks } from '../../../shared/models/networks.model';
import { Page } from '../../../shared/models/page.model';
import { AcnParameterService } from '../../../shared/service/acn-parameter/acn-parameter.service';
import { NetworksService } from '../../../shared/service/networks/networks.service';
import { AcnParameterDialogComponent } from '../acn-parameter-dialog/acn-parameter-dialog.component';

@Component({
  selector: 'stgo-acn-parameter-list',
  templateUrl: './acn-parameter-list.component.html',
  styleUrls: ['./acn-parameter-list.component.css']
})
export class AcnParameterListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  acnParameters: AcnParameterDTO[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  displayedColumns: string[] = ['network', 'acn', 'reminder', 'actions'];
  isAdmin: boolean;
  isOrderUser: boolean;
  panelFilterOpenState = false;
  advanceFilter: AcnParameterDTO;
  networks: Observable<Networks[]>;
  acns: string[] = [];
  reminders: any[] = [
    { label: 'No', value: 0 },
    { label: 'Mail', value: 1 },
    { label: 'Mail + Popup', value: 2 }
  ];

  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  inputNetwork: Subject<string> = new Subject<string>();
  inputDeviceValuesList: Subject<string> = new Subject<string>();

  acnParameterAdvanceFilterForm = this.fb.group({
    network: [null, Validators.required],
    acn: [null, Validators.required],
    reminder: ['', [Validators.required, Validators.minLength(1)]]
  });

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private networksService: NetworksService,
    private acnParameterService: AcnParameterService,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.networks = this.inputNetwork.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.networksService.getAllNetworks(value, 0, 50, 'code', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );

    this.getAllAcns(this.advanceFilter);

    this.sub$.add(
      this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchValue => {
        this.searchValue = searchValue;
        this.resetAdvanceFilter();
      })
    );
    this.acnParameterAdvanceFilterForm.patchValue({
      reminder: null
    });
  }

  ngAfterViewInit() {
    this.getAllAcnParameters('network', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNetworkSelected(network: Networks): void {
    if (network) {
      this.advanceFilter = new AcnParameterDTO();
      this.advanceFilter.network = network ? network : null;
      this.getAllAcns(this.advanceFilter);
    } else {
      this.acnParameterAdvanceFilterForm.get('network').setValue(null);
      this.acnParameterAdvanceFilterForm.get('acn').setValue(null);
    }
  }

  addAcnParameter(): void {
    const dialogRef = this.dialog.open(AcnParameterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'add', acnParameter: new AcnParameter() }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editAcnParameter(data: AcnParameter): void {
    const dialogRef = this.dialog.open(AcnParameterDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { mode: 'edit', acnParameter: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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
    this.advanceFilter = Object.assign({}, this.acnParameterAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.acnParameterAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.pageIndex = 0;
    this.getAllAcnParameters(this.sort.active, this.sort.direction, this.searchValue);
    this.getAllAcns(this.advanceFilter);
  }

  private getAllAcns(acnFilter: AcnParameterDTO): void {
    this.sub$.add(
      this.acnParameterService
        .getAllAcnParameters(0, 1000, 'acn', 'asc', '', acnFilter)
        .subscribe((page: Page<AcnParameterDTO>) => {
          if (page) {
            this.acns = page.content.map(a => a.acn).filter((x, i, a) => x && a.indexOf(x) === i);
          }
        })
    );
  }

  private countAdvanceFilter(acnParameterFilter: AcnParameterDTO): void {
    this.filterCount = 0;
    if (acnParameterFilter) {
      if (acnParameterFilter.acn) {
        this.filterCount++;
      }
      if (acnParameterFilter.network) {
        this.filterCount++;
      }
      if (acnParameterFilter.reminder) {
        this.filterCount++;
      }
    }
  }

  private getAllAcnParameters(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    acnParameterFilter?: AcnParameterDTO
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.acnParameterService
        .getAllAcnParameters(this.pageIndex, this.pageSize, sortField, sortDirection, search, acnParameterFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<AcnParameterDTO>) => {
          if (page) {
            this.acnParameters = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
