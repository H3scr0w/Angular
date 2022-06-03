import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page, Sector, SectorFilter, SectorService } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { SectorDialogComponent } from '../sector-dialog/sector-dialog.component';

@Component({
  selector: 'stgo-sector-list',
  templateUrl: './sector-list.component.html',
  styleUrls: ['./sector-list.component.scss']
})
export class SectorListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  sectors: Sector[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  advanceFilter: SectorFilter;
  panelFilterOpenState = true;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  sectorAdvanceFilterForm = this.fb.group({
    id: [''],
    name: [''],
    showArchived: ['']
  });

  private filter: Subject<string> = new Subject();
  private filter$: Subscription;
  private sectorSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private sectorService: SectorService,
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

    this.sub$.add(this.filter$);
    this.sub$.add(this.sectorSubscription);
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.getAllSectors('id', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  addSector(): void {
    this.dialog
      .open(SectorDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { sector: new Sector(), mode: 'add' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  editSector(data: Sector): void {
    this.dialog
      .open(SectorDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { sector: data, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  deleteSector(data: string): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '600px',
        disableClose: true,
        data: this.translateService.instant('common.delete.confirmation.message')
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          this.sectorSubscription = this.sectorService
            .deleteSector(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
                this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            });
        }
      });
  }

  recoverSector(data: Sector): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '600px',
        disableClose: true,
        data: this.translateService.instant('common.recover.confirmation.message')
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          this.sectorSubscription = this.sectorService
            .recoverSector(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
                this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            });
        }
      });
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue.length > 0) {
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
    this.advanceFilter = Object.assign({}, this.sectorAdvanceFilterForm.value);
    this.countAdvanceFilter();
    this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.sectorAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter();
    this.getAllSectors(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(): void {
    this.filterCount = 0;
    if (this.advanceFilter) {
      if (this.advanceFilter.id) {
        this.filterCount++;
      }
      if (this.advanceFilter.name) {
        this.filterCount++;
      }
      if (this.advanceFilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  private getAllSectors(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: SectorFilter
  ): void {
    this.isLoading = true;
    this.sectorSubscription = this.sectorService
      .getAllSectors(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Sector>) => {
        if (page) {
          this.sectors = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }
}
