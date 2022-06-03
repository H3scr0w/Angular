import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page } from '@shared';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, mergeMap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Segmentation, SegmentationFilter } from '../../../shared/models/segmentation.model';
import { SegmentationService } from '../../../shared/services/segmentation/segmentation.service';
import { SegmentationDialogComponent } from '../segmentation-dialog/segmentation-dialog.component';

@Component({
  selector: 'stgo-segmentation-list',
  templateUrl: './segmentation-list.component.html',
  styleUrls: ['./segmentation-list.component.css']
})
export class SegmentationListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  isLoading = false;
  segmentation: Observable<Segmentation[]>;
  segmentations: Segmentation[] = [];
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  filterCount = 0;
  advanceFilter: SegmentationFilter;
  panelFilterOpenState = true;
  displayedColumns: string[] = ['name', 'paloZoneName', 'popItems', 'comments', 'actions'];
  segmentationAdvanceFilterForm = this.fb.group({
    name: [''],
    isDeleted: ['']
  });
  private sub$: Subscription = new Subscription();
  private filter: Subject<string> = new Subject();
  private filter$: Subscription;

  constructor(
    public dialog: MatDialog,
    private segmentationService: SegmentationService,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe(searchTextValue => {
      this.resetAdvanceFilter();
      this.pageIndex = 0;
    });

    this.sub$.add(this.filter$);
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.getAllSegmentation('name', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  private getAllSegmentation(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    advancefilter?: SegmentationFilter
  ): void {
    this.isLoading = true;
    this.sub$.add(
      this.segmentationService
        .getAllSegmentation(search, this.pageIndex, this.pageSize, sortField, sortDirection, advancefilter)
        .pipe(mergeMap(param => this.setPopItems(param)))
        .subscribe(val => {
          this.isLoading = false;
          this.segmentations = val;
        })
    );
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
    this.advanceFilter = Object.assign({}, this.segmentationAdvanceFilterForm.value);
    this.countAdvanceFilter();
    this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.filterCount = 0;
    this.segmentationAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  addSegmentation(): void {
    this.dialog
      .open(SegmentationDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { segmentation: new Segmentation(), mode: 'add' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  editSegmentation(data: Segmentation): void {
    this.dialog
      .open(SegmentationDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { segmentation: data, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  deleteSegmentation(data: number): void {
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
          this.sub$.add(
            this.segmentationService
              .deleteSegmentation(data)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(res => {
                this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
                this.getAllSegmentation(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              })
          );
        }
      });
  }

  private countAdvanceFilter(): void {
    this.filterCount = 0;
    if (this.advanceFilter) {
      if (this.advanceFilter.name) {
        this.filterCount++;
      }
    }
  }

  private setPopItems(res: Page<Segmentation>): Observable<Segmentation[]> {
    const segmentation: Segmentation[] = [];
    if (res.content) {
      res.content.forEach(data => {
        this.sub$.add(
          this.segmentationService.getPopItemsBySegmentId(data.id).subscribe(popItems => {
            data.popItems = popItems;
          })
        );
        segmentation.push(data);
      });
      this.totalElements = res.totalElements;
      this.cdRef.detectChanges();
    }
    return of(segmentation);
  }
}
