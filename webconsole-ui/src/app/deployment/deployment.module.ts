import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { DeploymentRoutingModule } from './deployment-routing.module';
import { DeploymentComponent } from './deployment.component';

@NgModule({
  declarations: [DeploymentComponent],
  imports: [CommonModule, SharedModule, DeploymentRoutingModule]
})
export class DeploymentModule {}
