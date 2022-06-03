import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  IncapsulaResponse,
  Threat,
  TimeRanges
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { TrafficService } from '../../../../../shared/services/tools/incapsula/traffic.service';

@Component({
  selector: 'stgo-incapsula-incidents',
  templateUrl: './incapsula-incidents.component.html',
  styleUrls: ['./incapsula-incidents.component.css']
})
export class IncapsulaIncidentsComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  isAdmin: boolean;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  ELEMENT_DATA: Threat[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['id', 'incidents'];
  isLoading = false;

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

    this.dataSource.sort = this.sort;
    this.getAllIncidents();
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

  getAllIncidents(): void {
    this.ELEMENT_DATA = [];
    if (this.isAdmin) {
      this.getIncidents();
    }
  }

  private getIncidents(): void {
    this.isLoading = true;
    this.init$ = this.trafficService
      .getThreats(this.domain.code, this.formGroup.get('time')!.value.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: IncapsulaResponse) => {
        if (response.threats && response.threats.length > 0) {
          this.reduceMapThreats(response.threats);
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.dataSource.sort = this.sort;
          this.cdRef.detectChanges();
        }
      });
  }

  private reduceMapThreats(threats: Threat[]): void {
    threats
      .filter((t) => t.id === 'Bot Access Control')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);

    threats
      .filter((t) => t.id === 'Suspected Bots')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Illegal Resource Access')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Remote File Injections')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'DDoS')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Backdoor Protect')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'SQL Injection')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Cross Site Scripting')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Visitors from blacklisted Countries')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Visitors from blacklisted URLs')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
    threats
      .filter((t) => t.id === 'Visitors from blacklisted IPs')
      .reduce((incidents, threat, index, array) => {
        const total = incidents + threat.incidents;

        if (index === array.length - 1) {
          this.ELEMENT_DATA.push(new Threat(threat.id, total));
        }

        return total;
      }, 0);
  }
}
