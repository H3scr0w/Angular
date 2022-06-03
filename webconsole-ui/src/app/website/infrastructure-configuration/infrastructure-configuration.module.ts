import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { InfrastructureConfigurationRoutingModule } from './infrastructure-configuration-routing.module';
import { InfrastructureConfigurationComponent } from './infrastructure-configuration.component';

@NgModule({
  imports: [CommonModule, SharedModule, InfrastructureConfigurationRoutingModule],
  declarations: [InfrastructureConfigurationComponent]
})
export class InfrastructureConfigurationModule {}
