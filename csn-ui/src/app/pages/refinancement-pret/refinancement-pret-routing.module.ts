import {RouterModule, Routes} from '@angular/router';
import {TwoColumnsLayoutComponent} from '../../layout/two-columns-layout/two-columns-layout.component';
import {NgModule} from '@angular/core';
import {RefinancementPretCalculComponent} from './refinancement-pret-calcul/refinancement-pret-calcul.component';
import {RefinancementPretRestitComponent} from './refinancement-pret-restit/refinancement-pret-restit.component';
import {RefinancementPretInfobullesResolve} from './refinancement-pret-infobulles-resolve';

const routes: Routes = [{
  path: 'refinancement-pret',
  component: TwoColumnsLayoutComponent,
  children: [
    {path: '', component: RefinancementPretRestitComponent, outlet: 'result'},
    {path: '', component: RefinancementPretCalculComponent},
  ],
  resolve: {
    infoBulles: RefinancementPretInfobullesResolve,
  },
  data: {
    title: '{{refinancementPret}}',
    breadcrumb: [
      {
        label: '{{accueil}}',
        url: '/',
      },
      {
        label: '{{refinancementPret}}',
        url: '',
      },
    ],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefinancementPretRoutingModule {
}
