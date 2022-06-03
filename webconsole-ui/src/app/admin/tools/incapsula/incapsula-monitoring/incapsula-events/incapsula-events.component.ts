import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  IncapsulaResponse,
  TimeRanges,
  Visit
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { TrafficService } from '../../../../../shared/services/tools/incapsula/traffic.service';

@Component({
  selector: 'stgo-incapsula-events',
  templateUrl: './incapsula-events.component.html',
  styleUrls: ['./incapsula-events.component.css']
})
export class IncapsulaEventsComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  isAdmin: boolean;

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  ELEMENT_DATA: Visit[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['date', 'client', 'visit'];
  totalElements: number;
  isLoading = false;
  pageIndex = 0;
  pageSize = 100;

  timeDefault = { value: TimeRanges.today, tag: 'Today' };
  times = [
    this.timeDefault,
    {
      value: TimeRanges.month_to_date,
      tag: 'Month To Date'
    },
    {
      value: TimeRanges.last_7_days,
      tag: 'Last 7 Days'
    },
    {
      value: TimeRanges.last_30_days,
      tag: 'Last 30 Days'
    },
    {
      value: TimeRanges.last_90_days,
      tag: 'Last 90 Days'
    }
  ];

  formGroup: FormGroup;

  private init$: Subscription;

  constructor(private trafficService: TrafficService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      time: new FormControl(this.timeDefault)
    });

    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllEvents();
  }

  ngOnDestroy(): void {
    if (this.init$) {
      this.init$.unsubscribe();
    }
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllEvents(): void {
    this.pageIndex = 0;
    this.totalElements = 0;
    this.ELEMENT_DATA = [];
    this.getEvents();
  }

  getLastAllEvents(): void {
    // Last page
    if (!this.paginator.hasNextPage()) {
      this.pageIndex++;
      this.getEvents();
    }
  }

  private getEvents(): void {
    if (this.isAdmin) {
      this.isLoading = true;
      this.init$ = this.trafficService
        .getAllVisits(this.domain.code, this.formGroup.get('time')!.value.value, this.pageIndex, this.pageSize)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response: IncapsulaResponse) => {
          if (response.visits && response.visits.length > 0) {
            this.totalElements += response.visits.length;
            this.ELEMENT_DATA.push(...response.visits);
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.cdRef.detectChanges();
          }
        });
    }
  }
}
