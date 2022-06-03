import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { LaunchCampaignModel } from '../../../shared/models/launch.campaign.model';
import { CampaignService } from '../../../shared/service/campaign/campaign.service';

@Component({
  selector: 'stgo-launch-campaign',
  templateUrl: './launch-campaign.component.html',
  styleUrls: ['./launch-campaign.component.scss']
})
export class LaunchCampaignComponent implements OnInit, OnDestroy {
  campaign: LaunchCampaignModel = new LaunchCampaignModel();
  isLoading = false;
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private translateService: TranslateService,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  launchCampaign(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      disableClose: true,
      data: {
        message: this.translateService.instant('launch.campaign.confirmation.message'),
        year: this.campaign.year,
        value: '?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createCampaign(this.campaign.year.toString(), this.campaign.copyPrevious);
      }
    });
  }

  isYearHasError(): boolean {
    return !this.campaign.year || this.campaign.year === 0;
  }

  private createCampaign(year: string, isPreviousCampaign: boolean): void {
    this.isLoading = true;
    this.sub$.add(
      this.campaignService
        .createCampaign(year, isPreviousCampaign)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((campaign: LaunchCampaignModel) => {
          if (campaign) {
            this.router.navigate(['admin/campaigns']);
          }
        })
    );
  }
}
