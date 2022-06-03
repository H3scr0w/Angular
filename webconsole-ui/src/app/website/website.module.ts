import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { WebsiteRoutingModule } from './website-routing.module';
import { WebsiteComponent } from './website.component';

@NgModule({
  declarations: [WebsiteComponent],
  imports: [CommonModule, SharedModule, WebsiteRoutingModule]
})
export class WebsiteModule {}
