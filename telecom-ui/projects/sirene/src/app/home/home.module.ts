import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { CompanyHomeComponent } from './company-home/company-home.component';
import { CountryHomeComponent } from './country-home/country-home.component';
import { DelegationHomeComponent } from './delegation-home/delegation-home.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SectorHomeComponent } from './sector-home/sector-home.component';
import { ZoneHomeComponent } from './zone-home/zone-home.component';

@NgModule({
  imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule],
  declarations: [
    HomeComponent,
    CountryHomeComponent,
    SectorHomeComponent,
    ZoneHomeComponent,
    CompanyHomeComponent,
    DelegationHomeComponent
  ]
})
export class HomeModule {}
