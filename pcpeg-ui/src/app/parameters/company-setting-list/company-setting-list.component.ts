import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { SortDirection } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CampaignFilter, CampaignModel } from 'src/app/shared/models/campaign.model';
import { Page } from 'src/app/shared/models/page.model';
import { PaymentTypes } from 'src/app/shared/models/payment-types';
import { YearModel } from 'src/app/shared/models/year.model';
import { CampaignService } from 'src/app/shared/service/campaign/campaign.service';
import { YearService } from 'src/app/shared/service/year/year.service';
import { CompanySwitchService } from '../../shared/service/company-switch/company-switch.service';

@Component({
  selector: 'stgo-company-setting-list',
  templateUrl: './company-setting-list.component.html',
  styleUrls: ['./company-setting-list.component.scss']
})
export class CompanySettingListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  isLoading = false;
  totalElements: number;
  pageIndex = 0;
  pageSize = 5;
  campaigns: CampaignModel[] = [];
  currentYear: number;
  interestPayment: number = PaymentTypes.INTERET;
  participationPayment: number = PaymentTypes.PARTICIPATION;
  interestSuppPayment: number = PaymentTypes.INTEREST_SUPP;
  participationSuppPayment: number = PaymentTypes.PARTICIPATION_SUPP;
  cetPayment: number = PaymentTypes.CET;
  private sub$: Subscription = new Subscription();

  constructor(
    private cdRef: ChangeDetectorRef,
    private campaignService: CampaignService,
    private companySwitchService: CompanySwitchService,
    private yearService: YearService,
    private router: Router
  ) {
    this.companySwitchService.notifyCompanyCampaign(null!);
    this.companySwitchService.notifyCompanySetting(null!, this.interestPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.participationPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.interestSuppPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.participationSuppPayment);
    this.companySwitchService.notifyCompanySetting(null!, this.cetPayment);
    this.getYears();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        if (this.currentYear) {
          this.getAllCampaigns('societeLibelle', 'asc', this.currentYear.toString());
        } else {
          this.getAllCampaigns('societeLibelle', 'asc');
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

  goToCompanySettings(campaign: CampaignModel): void {
    this.companySwitchService.notifyCompanyCampaign(campaign);
    setTimeout(() => {
      this.router.navigate(['parameters/company']);
    }, 500);
  }

  private getYears(): void {
    this.isLoading = true;
    this.sub$.add(
      this.yearService
        .getYears()
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((yearList: YearModel[]) => {
          if (yearList && yearList.length > 0) {
            const years = yearList.map((year) => year);

            if (years && years.length > 0) {
              this.currentYear = years[0].anneeId;
            } else {
              this.currentYear = null!;
            }

            if (this.currentYear) {
              this.getAllCampaigns('societeLibelle', 'asc', this.currentYear.toString());
            } else {
              this.getAllCampaigns('societeLibelle', 'asc');
            }
          }
        })
    );
  }

  private getAllCampaigns(sortField?: string, sortDirection?: SortDirection, year?: string): void {
    this.isLoading = true;
    const advanceFilter = new CampaignFilter();
    advanceFilter.year = year;
    this.sub$.add(
      this.campaignService
        .getAllCompaigns(this.pageIndex, this.pageSize, sortField, sortDirection, advanceFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<CampaignModel>) => {
          if (page) {
            this.campaigns = page.content;
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
