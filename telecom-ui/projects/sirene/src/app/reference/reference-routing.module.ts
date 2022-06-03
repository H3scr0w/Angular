import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityListComponent } from './city/city-list/city-list.component';
import { CountryListComponent } from './country/country-list/country-list.component';
import { DelegationListComponent } from './delegation/delegation-list/delegation-list.component';
import { SectorListComponent } from './sector/sector-list/sector-list.component';
import { SegmentationListComponent } from './segmentation/segmentation-list/segmentation-list.component';
import { ZoneListComponent } from './zone/zone-list/zone-list.component';

/**
 * The routes
 */
const routes: Routes = [
  { path: '', redirectTo: 'delegation', pathMatch: 'full' },
  {
    path: 'delegation',
    component: DelegationListComponent,
    pathMatch: 'full',
    data: { title: 'Delegation' }
  },
  {
    path: 'country',
    component: CountryListComponent,
    pathMatch: 'full',
    data: { title: 'Country' }
  },
  {
    path: 'city',
    component: CityListComponent,
    pathMatch: 'full',
    data: { title: 'City' }
  },
  {
    path: 'sector',
    component: SectorListComponent,
    pathMatch: 'full',
    data: { title: 'Sector' }
  },
  {
    path: 'segmentation',
    component: SegmentationListComponent,
    pathMatch: 'full',
    data: { title: 'Segmentation' }
  },
  {
    path: 'zone',
    component: ZoneListComponent,
    pathMatch: 'full',
    data: { title: 'Zone' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferenceRoutingModule {}
