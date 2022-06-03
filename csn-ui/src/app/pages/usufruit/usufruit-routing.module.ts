import {RouterModule, Routes} from '@angular/router';
import {TwoColumnsLayoutComponent} from '../../layout/two-columns-layout/two-columns-layout.component';
import {NgModule} from '@angular/core';
import {UsufruitRestitComponent} from './usufruit-restit/usufruit-restit.component';
import {UsufruitInfobullesResolve} from './usufruit-infobulles-resolve';
import {UsufruitExportComponent} from './usufruit-export/usufruit-export.component';
import {UsufruitCalculComponent} from './usufruit-calcul/usufruit-calcul.component';

const routes: Routes = [
  {
    path: 'usufruit',
    component: TwoColumnsLayoutComponent,
    children: [
      {path: '', component: UsufruitRestitComponent, outlet: 'result'},
      {path: '', component: UsufruitCalculComponent},
      {path: '**', redirectTo: '/usufruit'},
    ],
    resolve: {
      infoBulles: UsufruitInfobullesResolve,
    },
    data: {
      title: '{{usufruit}}',
      breadcrumb: [
        {
          label: '{{accueil}}',
          url: '/',
        },
        {
          label: '{{usufruit}}',
          url: '',
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsufruitRoutingModule {
}
