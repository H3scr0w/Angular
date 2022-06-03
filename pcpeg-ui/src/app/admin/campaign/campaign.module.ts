import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignRoutingModule } from './campaign-routing.module';
import { LaunchCampaignComponent } from './launch-campaign/launch-campaign.component';

@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, CampaignRoutingModule],
  declarations: [CampaignListComponent, LaunchCampaignComponent]
})
export class CampaignModule {}
