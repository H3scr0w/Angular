import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { WsipConfigurationRoutingModule } from './wsip-configuration-routing.module';
import { WsipConfigurationComponent } from './wsip-configuration.component';
import { WsipProjectComponent } from './wsip-project/wsip-project.component';
import { WsipTechnicalComponent } from './wsip-technical/wsip-technical.component';

@NgModule({
  imports: [CommonModule, SharedModule, WsipConfigurationRoutingModule],
  declarations: [WsipConfigurationComponent, WsipProjectComponent, WsipTechnicalComponent]
})
export class WsipConfigurationModule {}
