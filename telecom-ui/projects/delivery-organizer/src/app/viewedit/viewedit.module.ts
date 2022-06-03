import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared';
import { ProjectBulkModificationComponent } from './project/project-bulk-modification/project-bulk-modification.component';
import { VieweditRoutingModule } from './viewedit-routing.module';

@NgModule({
  declarations: [ProjectBulkModificationComponent],
  imports: [CommonModule, VieweditRoutingModule,SharedModule,TranslateModule]
})
export class VieweditModule {}
