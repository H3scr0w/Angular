import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { CityDialogComponent } from './city/city-dialog/city-dialog.component';
import { CityListComponent } from './city/city-list/city-list.component';
import { CountryDialogComponent } from './country/country-dialog/country-dialog.component';
import { CountryListComponent } from './country/country-list/country-list.component';
import { DelegationDialogComponent } from './delegation/delegation-dialog/delegation-dialog.component';
import { DelegationValidator } from './delegation/delegation-dialog/delegation-validator';
import { DelegationListComponent } from './delegation/delegation-list/delegation-list.component';
import { ReferenceRoutingModule } from './reference-routing.module';
import { SectorDialogComponent } from './sector/sector-dialog/sector-dialog.component';
import { SectorListComponent } from './sector/sector-list/sector-list.component';
import { SegmentationDialogComponent } from './segmentation/segmentation-dialog/segmentation-dialog.component';
import { SegmentationListComponent } from './segmentation/segmentation-list/segmentation-list.component';
import { ZoneDialogComponent } from './zone/zone-dialog/zone-dialog.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';

@NgModule({
  declarations: [
    DelegationListComponent,
    DelegationDialogComponent,
    CountryListComponent,
    CountryDialogComponent,
    CityListComponent,
    CityDialogComponent,
    SectorListComponent,
    SectorDialogComponent,
    ZoneListComponent,
    ZoneDialogComponent,
    SegmentationDialogComponent,
    SegmentationListComponent
  ],
  imports: [CommonModule, SharedModule, TranslateModule, ReferenceRoutingModule],
  providers: [DelegationValidator]
})
export class ReferenceModule {}
