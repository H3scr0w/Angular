import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { RequestModule } from '../request/request.module';
import { CompanyRequestComponent } from './company-request/company-request.component';
import { SiteRequestComponent } from './site-request/site-request.component';
import { SupervisorRoutingModule } from './supervisor-routing.module';
import { SupervisorComponent } from './supervisor.component';

@NgModule({
  imports: [CommonModule, SharedModule, TranslateModule, SupervisorRoutingModule, RequestModule],
  declarations: [CompanyRequestComponent, SupervisorComponent, SiteRequestComponent]
})
export class SupervisorModule {}
