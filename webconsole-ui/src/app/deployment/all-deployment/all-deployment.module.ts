import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AllDeploymentRoutingModule } from './all-deployment-routing.module';
import { AllDeploymentComponent } from './all-deployment.component';
@NgModule({
  imports: [CommonModule, SharedModule, AllDeploymentRoutingModule],
  declarations: [AllDeploymentComponent]
})
export class AllDeploymentModule {}
