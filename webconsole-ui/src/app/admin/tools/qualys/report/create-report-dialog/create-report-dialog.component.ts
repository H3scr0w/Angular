import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, finalize, map, switchMap } from 'rxjs/operators';
import { Page } from '../../../../../shared/models/page.model';
import { ConfigReport } from '../../../../../shared/models/tools/qualys/configreport.model';
import { Report } from '../../../../../shared/models/tools/qualys/report.model';
import { ScanReport } from '../../../../../shared/models/tools/qualys/scanreport.model';
import { TargetReport } from '../../../../../shared/models/tools/qualys/targetreport.model';
import { ScanWrapper } from '../../../../../shared/models/tools/qualys/util/scanwrapper.model';
import { WasScan } from '../../../../../shared/models/tools/qualys/wasscan.model';
import { ReportService } from '../../../../../shared/services/tools/qualys/report.service';
import { WasscanService } from '../../../../../shared/services/tools/qualys/wasscan.service';

@Component({
  selector: 'stgo-create-report-dialog',
  templateUrl: './create-report-dialog.component.html',
  styleUrls: ['./create-report-dialog.component.css']
})
export class CreateReportDialogComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  saving = false;

  scanSelected: boolean;
  searchScan = false;

  wasscan$: Observable<WasScan[]>;

  private reportSubscription: Subscription;

  constructor(
    private reportService: ReportService,
    private wasScanService: WasscanService,
    public dialogRef: MatDialogRef<CreateReportDialogComponent>
  ) {}

  ngOnInit(): void {
    this.scanSelected = false;

    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      scan: new FormControl('', [Validators.required])
    });

    this.wasscan$ = this.formGroup.controls.scan.valueChanges.pipe(
      filter((query) => query.length >= 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.searchScan = true;
        return this.wasScanService.searchWasScansByName(query).pipe(
          finalize(() => (this.searchScan = false)),
          map((page: Page<WasScan>) => page.content)
        );
      })
    );
  }

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.saving = true;

    const report: Report = new Report();
    report.name = this.formGroup.get('name')!.value;

    report.config = new ConfigReport();
    report.config.scanReport = new ScanReport();
    report.config.scanReport.target = new TargetReport();
    report.config.scanReport.target.scans = new ScanWrapper();
    report.config.scanReport.target.scans.WasScan = new WasScan();

    const scan: WasScan = this.formGroup.get('scan')!.value;
    report.config.scanReport.target.scans.WasScan.id = scan.id;

    this.reportSubscription = this.reportService
      .createReport(report)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => this.dialogRef.close(true));
  }

  selectInput(action: boolean): void {
    this.scanSelected = action;
  }

  displayFn = (input: WasScan) => {
    if (input) {
      return input.name;
    }
    return '';
  }
}
