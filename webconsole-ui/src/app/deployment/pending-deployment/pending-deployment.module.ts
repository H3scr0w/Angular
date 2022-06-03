import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { PendingDeploymentRoutingModule } from './pending-deployment-routing.module';
import { PendingDeploymentComponent } from './pending-deployment.component';
@NgModule({
  imports: [CommonModule, SharedModule, PendingDeploymentRoutingModule],
  declarations: [PendingDeploymentComponent]
})
export class PendingDeploymentModule {}
