import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { YearModel } from 'src/app/shared/models/year.model';
import { YearService } from 'src/app/shared/service/year/year.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserDialogMode } from '../../../shared/components/user-dialog/user-dialog-data';
import { UserDialogComponent } from '../../../shared/components/user-dialog/user-dialog.component';
import { CampaignFilter, CampaignModel } from '../../../shared/models/campaign.model';
import { Page } from '../../../shared/models/page.model';
import { CampaignService } from '../../../shared/service/campaign/campaign.service';
import { MessageService } from '../../../shared/service/message/message.service';
import { CampaignStatsModel } from './../../../shared/models/campaign-stats.model';
import { CorrespondantModel } from './../../../shared/models/correspondant.model';

@Component({
  selector: 'stgo-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = [
    'codeSif',
    'societeLibelle',
    'correspondantN1',
    'correspondantN',
    'mail',
    'statut',
    'select',
    'actions'
  ];
  lockedColumns: string[] = [
    'codeSif',
    'societeLibelle',
    'correspondantN1',
    'correspondantN',
    'mail',
    'statut',
    'select'
  ];
  clonedDisplayedColumns = this.displayedColumns;
  isLoading = false;
  isStatsLoading = false;
  campaigns: CampaignModel[] = [];
  years: YearModel[] = [];
  campaignStats: CampaignStatsModel = new CampaignStatsModel();
  selection = new SelectionModel<CampaignModel>(true, []);
  campaignAllowToSelect: CampaignModel[] = [];
  showSelectAllCheckbox = false;
  currentYear: number;
  firstYear: number;
  lastYear: number;
  isBackButton: boolean;
  isNextButton: boolean;
  isVisible: boolean;
  isAllLocked: boolean;
  isLocked = false;
  isCampaignLocked = false;
  filterCount = 0;
  panelFilterOpenState = false;
  advanceFilterForm = this.fb.group({
    statutId: [null]
  });
  statuses = [
    { statusLabel: this.translateService.instant('common.todo'), statusId: 1 },
    { statusLabel: this.translateService.instant('common.pending'), statusId: 2 },
    { statusLabel: this.translateService.instant('common.validated'), statusId: 4 }
  ];
  advanceFilter: CampaignFilter;

  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private campaignService: CampaignService,
    private yearService: YearService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.getYears();
  }

  ngOnInit(): void {
    this.sub$.add(
      this.translateService.onLangChange.subscribe(() => {
        this.statuses = [
          { statusLabel: this.translateService.instant('common.todo'), statusId: 1 },
          { statusLabel: this.translateService.instant('common.pending'), statusId: 2 },
          { statusLabel: this.translateService.instant('common.validated'), statusId: 4 }
        ];
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        if (!this.isAllLocked) {
          this.pageIndex = 0;

          this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
        }
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        if (!this.isAllLocked) {
          this.pageIndex = this.paginator.pageIndex;
          this.pageSize = this.paginator.pageSize;
          this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
        }
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

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.advanceFilter = Object.assign(this.advanceFilterForm.value);
    this.advanceFilter.year = this.currentYear.toString();
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
  }

  countAdvanceFilter(filter?: CampaignFilter): void {
    this.filterCount = 0;
    if (filter) {
      if (filter.codeSif) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilterForm.reset();
    this.advanceFilter = new CampaignFilter();
    this.advanceFilter.year = this.currentYear.toString();
    this.countAdvanceFilter();
    this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.campaignAllowToSelect.length != null ? this.campaignAllowToSelect.length : 0;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.campaignAllowToSelect.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: CampaignModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.codeSif}`;
  }

  replaceCorrespondant(row: CampaignModel): void {
    if (row && row.id) {
      const dialogRef = this.dialog.open(UserDialogComponent, {
        width: '400px',
        disableClose: true,
        autoFocus: true,
        data: { campaignData: row, mode: UserDialogMode.CAMPAIGN }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllCompaigns(this.sort.active, this.sort.direction);
        }
      });
    }
  }

  deleteCorrespondant(row: CampaignModel): void {
    if (row && row.id) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: { message: this.translateService.instant('user.delete.confirmation.message') }
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.isLoading = true;
          this.sub$.add(
            this.campaignService
              .deleteCorrespondant(row.id!.societeSid, row.id!.anneeId)
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe(() => {
                this.messageService.show(this.translateService.instant('user.delete.confirmation.success'), 'success');
                this.getAllCompaigns(this.sort.active, this.sort.direction);
              })
          );
        }
      });
    }
  }

  launchEmail(): void {
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      const campaignsToNotify: CampaignModel[] = this.selection.selected.filter(
        (campaign) => !campaign.flagEnvoieMail && campaign.correspondantActuelId > 0
      );
      this.notifyCorrespondants(campaignsToNotify);
    }
  }

  relaunchEmail(): void {
    if (this.selection && this.selection.selected && this.selection.selected.length > 0) {
      const campaignsToRemind: CampaignModel[] = this.selection.selected.filter(
        (campaign) => campaign.flagEnvoieMail && campaign.correspondantActuelId > 0
      );
      this.notifyCorrespondants(campaignsToRemind, true);
    }
  }

  exportDetails(): void {
    this.isLoading = true;
    if (this.currentYear) {
      this.sub$.add(
        this.campaignService
          .downloadCampaigns(this.advanceFilter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((excelContent: Blob) => {
            if (excelContent) {
              const blob = new Blob([excelContent], { type: 'application/octet-stream' });
              saveAs(blob, 'Campaigns.xlsx');
            }
          })
      );
    }
  }

  private getAllCompaigns(sortField?: string, sortDirection?: SortDirection, filter?: CampaignFilter): void {
    this.isLoading = true;
    this.isVisible = false;
    this.isBackButton = true;

    this.selection.clear();
    this.sub$.add(
      this.campaignService
        .getAllCompaigns(this.pageIndex, this.pageSize, sortField, sortDirection, filter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CampaignModel>) => {
          if (page) {
            this.campaigns = page.content;
            this.campaignAllowToSelect = page.content;
            this.totalElements = page.totalElements;

            if (this.campaigns && this.campaigns.length > 0) {
              this.showSelectAllCheckbox = this.campaignAllowToSelect.length > 0;
              if (this.campaigns[0].id) {
                this.currentYear = this.campaigns[0].id.anneeId;
              }

              if (this.currentYear === this.firstYear) {
                this.isBackButton = false;
              }

              if (this.currentYear === this.lastYear) {
                this.isNextButton = false;
                this.isVisible = true;
                this.isCampaignLocked = this.isLocked;
                if (this.isLocked) {
                  this.displayedColumns = this.lockedColumns;
                } else {
                  this.displayedColumns = this.clonedDisplayedColumns;
                }
              } else {
                this.isNextButton = true;
                this.isCampaignLocked = true;
                this.displayedColumns = this.lockedColumns;
              }

              this.getCampaignStats('' + this.currentYear);
            } else {
              this.showSelectAllCheckbox = false;
            }
          }
        })
    );
  }

  private getCampaignStats(year: string): void {
    this.isStatsLoading = true;
    this.sub$.add(
      this.campaignService
        .getCampaignStats(year)
        .pipe(finalize(() => (this.isStatsLoading = false)))
        .subscribe((stats: CampaignStatsModel) => {
          if (stats) {
            this.campaignStats = stats;
            this.cdRef.detectChanges();
          }
        })
    );
  }

  private notifyCorrespondants(campaigns: CampaignModel[], isReminder?: boolean): void {
    if (campaigns && campaigns.length > 0) {
      this.isLoading = true;
      const correspondants: CorrespondantModel[] = campaigns.map(
        (campaign) =>
          new CorrespondantModel(
            '' + campaign.id!.societeSid,
            '' + campaign.id!.anneeId,
            '' + campaign.correspondantActuelId
          )
      );

      this.sub$.add(
        this.campaignService
          .notifyCorrespondants(correspondants, isReminder)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe(() => {
            if (isReminder) {
              this.messageService.show(this.translateService.instant('user.remind.success'), 'success');
            } else {
              this.messageService.show(this.translateService.instant('user.notify.success'), 'success');
            }
            this.getAllCompaigns(this.sort.active, this.sort.direction);
          })
      );
    }
  }

  private getYears(): void {
    this.isLoading = true;
    this.sub$.add(
      this.yearService
        .getYears()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((yearList: YearModel[]) => {
          if (yearList && yearList.length > 0) {
            this.years = yearList.map((x) => x);
            this.firstYear = this.years[this.years.length - 1].anneeId;
            this.lastYear = this.years[0].anneeId;
            const index: number = this.years.findIndex((lockedYear) => lockedYear.flagEnCours === true);

            if (index === -1 && this.lastYear) {
              this.isAllLocked = true;
              if (!this.advanceFilter) {
                this.advanceFilter = new CampaignFilter();
              }
              this.advanceFilter.year = this.lastYear.toString();
              this.getAllCompaigns('codeSif', 'asc', this.advanceFilter);
              this.isVisible = true;
              this.isLocked = true;
              this.isCampaignLocked = true;
              this.displayedColumns = this.lockedColumns;
            } else {
              this.getAllCompaigns('codeSif', 'asc');
            }
          }
        })
    );
  }

  changeCampaignStatus(): void {
    const year: string = this.currentYear.toString();
    let statusMessage = this.translateService.instant('campaign.close.waring.message', { year });

    if (!this.isLocked) {
      statusMessage = this.translateService.instant('campaign.open.waring.message', { year });
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        message: statusMessage
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.isLocked) {
        this.closeCampaign(this.currentYear.toString());
        this.displayedColumns = this.lockedColumns;
        this.isCampaignLocked = true;
      } else if (result && !this.isLocked) {
        this.openCampaign(this.currentYear.toString());
        this.isCampaignLocked = false;
        this.displayedColumns = this.clonedDisplayedColumns;
      } else if (!result && this.isLocked) {
        this.isLocked = false;
      } else {
        this.isLocked = true;
        this.displayedColumns = this.clonedDisplayedColumns;
      }

      this.cdRef.detectChanges();
    });
  }

  closeCampaign(year: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.campaignService
        .closeCampaign(year)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.messageService.show(this.translateService.instant('campaign.close.success.message'), 'success');
          if (!this.advanceFilter) {
            this.advanceFilter = new CampaignFilter();
          }
          this.advanceFilter.year = this.currentYear.toString();
          this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
        })
    );
  }

  openCampaign(year: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.campaignService
        .openCampaign(year)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe(() => {
          this.messageService.show(this.translateService.instant('campaign.open.success.message'), 'success');
          this.getAllCompaigns(this.sort.active, this.sort.direction);
        })
    );
  }

  getYear(yearCheck: string): void {
    if (this.years && this.years.length > 0) {
      const index = this.years.findIndex((year) => year.anneeId === this.currentYear);
      let selectedYear = 0;

      if (index !== -1) {
        if (yearCheck === 'isPrevious') {
          selectedYear = this.years[index + 1].anneeId;
        } else {
          selectedYear = this.years[index - 1].anneeId;
        }
      }
      if (!selectedYear) {
        return;
      }

      if (selectedYear !== this.lastYear) {
        this.isCampaignLocked = false;
        this.displayedColumns = this.clonedDisplayedColumns;
      } else if (selectedYear === this.lastYear && this.isLocked) {
        this.isCampaignLocked = true;
        this.displayedColumns = this.lockedColumns;
      }
      if (!this.advanceFilter) {
        this.advanceFilter = new CampaignFilter();
      }
      this.advanceFilter.year = selectedYear.toString();
      this.getAllCompaigns(this.sort.active, this.sort.direction, this.advanceFilter);
    }
  }
}
