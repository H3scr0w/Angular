import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupGuard } from '../shared/guards/user-group.guard';
import { CatalogReplacementComponent } from './catalog-replacement/catalog-replacement.component';
import { ChangeServicesComponent } from './change-services/change-services.component';
import { FollowupComponent } from './followup/followup.component';
import { IspBandwidthComponent } from './isp-bandwidth/isp-bandwidth.component';
import { OrderMakeListComponent } from './order-make/order-make-list/order-make-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'follow', pathMatch: 'full' },
  {
    path: 'follow',
    component: FollowupComponent,
    pathMatch: 'full',
    data: { title: 'Orders' }
  },
  {
    path: 'follow/:orderId',
    component: FollowupComponent,
    pathMatch: 'full',
    data: { title: 'Orders' }
  },
  {
    path: 'change-services',
    component: ChangeServicesComponent,
    pathMatch: 'full',
    data: { title: 'Change Services' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'isp-bandwidth',
    component: IspBandwidthComponent,
    pathMatch: 'full',
    data: { title: 'Orders' }
  },
  {
    path: 'catalog-replacement',
    component: CatalogReplacementComponent,
    pathMatch: 'full',
    data: { title: 'Make Replacement Clause' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'make',
    component: OrderMakeListComponent,
    pathMatch: 'full',
    data: { title: 'Make an Order' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}
