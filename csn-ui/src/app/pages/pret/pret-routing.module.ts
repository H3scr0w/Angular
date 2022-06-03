import {RouterModule, Routes} from '@angular/router';
import {TwoColumnsLayoutComponent} from '../../layout/two-columns-layout/two-columns-layout.component';
import {NgModule} from '@angular/core';
import {PretCalculComponent} from './pret-calcul/pret-calcul.component';
import {PretRestitComponent} from './pret-restit/pret-restit.component';
import {PretInfobullesResolve} from './pret-infobulles-resolve';

const routes: Routes = [
  {
    path: 'pret',
    component: TwoColumnsLayoutComponent,
    children: [
      {path: '', component: PretRestitComponent, outlet: 'result'},
      {path: '', component: PretCalculComponent},
      {path: '**', redirectTo: '/pret'},
    ], resolve: {
      infoBulles: PretInfobullesResolve,
    },
    data: {
      title: '{{pret}}',
      breadcrumb: [
        {
          label: '{{accueil}}',
          url: '/',
        },
        {
          label: '{{pret}}',
          url: '',
        },
      ],
    },
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PretRoutingModule {
}
