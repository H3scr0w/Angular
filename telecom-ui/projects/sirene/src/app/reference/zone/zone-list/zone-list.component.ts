import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page, Sector, SectorService, Zone, ZoneFilter, ZoneService } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ZoneDialogComponent } from '../zone-dialog/zone-dialog.component';

export interface DialogData {
  mode: string;
  zone: Zone;
  message: string;
}

@Component({
  selector: 'stgo-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  zones: Zone[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  panelFilterOpenState = true;
  advanceFilter: ZoneFilter;
  displayedColumns: string[] = ['id', 'name', 'sector', 'actions'];
  sectors: Observable<Sector[]>;
  zoneAdvanceFilterForm = this.fb.group({
    id: [''],
    name: [''],
    sector: [''],
    showArchived: ['']
  });

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private zoneSubscription: Subscription;
  private sub$: Subscription = new Subscription();
  inputSector: Subject<string> = new Subject<string>();

  constructor(
    public dialog: MatDialog,
    private zoneService: ZoneService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private sectorService: SectorService
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.pageIndex = 0;
      this.resetAdvanceFilter();
    });

    this.sectors = this.inputSector.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.sectorService.getAllSectors(query, 0, 50, 'name', 'asc').pipe(
          switchMap(result => {
            return of(result.content);
          })
        );
      })
    );
    this.zoneAdvanceFilterForm.controls.sector.setValue(null);
    this.sub$.add(this.filter$);
    this.sub$.add(this.zoneSubscription);
  }

  ngAfterViewInit() {
    this.getAllZones('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
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

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign(this.zoneAdvanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.zoneAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter(null);
    this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  addZone(): void {
    const dialogRef = this.dialog.open(ZoneDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { zone: new Zone(), mode: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  editZone(data: Zone): void {
    const dialogRef = this.dialog.open(ZoneDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { zone: data, mode: 'edit' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'close') {
        this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      }
    });
  }

  deleteZone(data: Zone): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.delete.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.zoneSubscription = this.zoneService
          .deleteZone(data.id)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
              this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  recoverZone(data: Zone): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: this.translateService.instant('common.recover.confirmation.message')
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.zoneSubscription = this.zoneService
          .recoverZone(data)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(res => {
            if (res) {
              this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
              this.getAllZones(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
            }
          });
      }
    });
  }

  private countAdvanceFilter(zoneFilter: ZoneFilter): void {
    this.filterCount = 0;
    if (zoneFilter) {
      if (zoneFilter.id) {
        this.filterCount++;
      }
      if (zoneFilter.name) {
        this.filterCount++;
      }
      if (zoneFilter.sector) {
        this.filterCount++;
      }
      if (zoneFilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  private getAllZones(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    zoneFilter?: ZoneFilter
  ): void {
    this.isLoading = true;
    this.zoneSubscription = this.zoneService
      .getAllZones(search, this.pageIndex, this.pageSize, null, sortField, sortDirection, zoneFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Zone>) => {
        if (page) {
          this.zones = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }

  displaySectorFn(sector?: Sector): string | undefined {
    return sector ? sector.name : undefined;
  }
}
