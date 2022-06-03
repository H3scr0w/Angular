import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { FacilityRoutingModule } from './facility-routing.module';
import { FacilityListComponent } from './facility/facility-list.component';

@NgModule({
  declarations: [FacilityListComponent],
  imports: [CommonModule, SharedModule, TranslateModule, FacilityRoutingModule]
})
export class FacilityModule {}
