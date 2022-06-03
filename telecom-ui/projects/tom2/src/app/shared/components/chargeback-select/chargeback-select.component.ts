import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Chargeback, ChargebackFilter } from '../../../../../../tempo/src/app/shared/models/chargeback';
import { ChargebackService } from '../../../../../../tempo/src/app/shared/service/chargeback/chargeback.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'stgo-chargeback-select',
  templateUrl: './chargeback-select.component.html',
  styleUrls: ['./chargeback-select.component.css']
})
export class ChargebackSelectComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  searchValue: string;
  chargebacks: Chargeback[];
  chargebackFilter: ChargebackFilter;

  displayedColumns: string[] = ['label', 'sapAccount', 'sif', 'actions'];

  chargebackSelectForm = this.fb.group({
    label: [''],
    sapAccount: [''],
    sif: ['']
  });
  private sub$: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private chargebackService: ChargebackService,
    public dialogRef: MatDialogRef<ChargebackSelectComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.getAllChargebacks('label', 'asc');
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllChargebacks(this.sort.active, this.sort.direction, this.searchValue);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllChargebacks(this.sort.active, this.sort.direction, this.searchValue);
      });
    }
    this.cdRef.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  applyFilter(): void {
    this.chargebackFilter = this.chargebackSelectForm.value;
    this.getAllChargebacks(this.sort.active, this.sort.direction, this.searchValue);
  }

  onChargebackSelected(chargeback: Chargeback): void {
    if (!chargeback) {
      return;
    }
    this.dialogRef.close(chargeback);
  }

  onResetClick(): void {
    this.chargebackSelectForm.reset();
    this.getAllChargebacks(this.sort.active, this.sort.direction, this.searchValue);
  }

  private getAllChargebacks(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.chargebackService.url = '/tempo/chargebacks';
    if (this.chargebackFilter) {
      this.chargebackFilter.display = 1;
    } else {
      this.chargebackFilter = new ChargebackFilter();
      this.chargebackFilter.display = 1;
    }
    this.sub$.add(
      this.chargebackService
        .getAllChargebacks(this.pageIndex, this.pageSize, sortField, sortDirection, search, this.chargebackFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Chargeback>) => {
          if (page) {
            this.chargebacks = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
