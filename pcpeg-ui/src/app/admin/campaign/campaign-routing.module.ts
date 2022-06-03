import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { LaunchCampaignComponent } from './launch-campaign/launch-campaign.component';

/**
 * The routes
 */
const routes: Routes = [
  { path: '', redirectTo: 'campaigns', pathMatch: 'full' },
  {
    path: 'campaigns',
    component: CampaignListComponent,
    pathMatch: 'full',
    data: { title: 'Campaigns' }
  },
  {
    path: 'launch-campaign',
    component: LaunchCampaignComponent,
    pathMatch: 'full',
    data: { title: 'Launch Campaign' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignRoutingModule {}
