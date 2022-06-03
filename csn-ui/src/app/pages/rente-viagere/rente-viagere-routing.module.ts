import {RouterModule, Routes} from '@angular/router';
import {TwoColumnsLayoutComponent} from '../../layout/two-columns-layout/two-columns-layout.component';
import {NgModule} from '@angular/core';
import {RenteViagereCalculComponent} from './rente-viagere-calcul/rente-viagere-calcul.component';
import {RenteViagereRestitComponent} from './rente-viagere-restit/rente-viagere-restit.component';
import {RenteviagereInfobullesResolve} from './renteviagere-infobulles-resolve';
import {RenteViagereExportComponent} from './rente-viagere-export/rente-viagere-export.component';

const routes: Routes = [
  {
    path: 'rente-viagere',
    component: TwoColumnsLayoutComponent,
    children: [
      {path: '', component: RenteViagereRestitComponent, outlet: 'result'},
      {path: '', component: RenteViagereCalculComponent},
      {path: '**', redirectTo: '/rente-viagere'},
    ],
    resolve: {
      infoBulles: RenteviagereInfobullesResolve,
    },
    data: {
      title: '{{renteViagere}}',
      breadcrumb: [
        {
          label: '{{accueil}}',
          url: '/',
        },
        {
          label: '{{renteViagere}}',
          url: '',
        },
      ],
    },
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RenteViagereRoutingModule {
}
