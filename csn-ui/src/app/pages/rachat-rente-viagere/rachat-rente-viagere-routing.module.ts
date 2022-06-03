import {RouterModule, Routes} from '@angular/router';
import {TwoColumnsLayoutComponent} from '../../layout/two-columns-layout/two-columns-layout.component';
import {NgModule} from '@angular/core';
import {RachatRenteViagereCalculComponent} from './rachat-rente-viagere-calcul/rachat-rente-viagere-calcul.component';
import {RachatRenteViagereRestitComponent} from './rachat-rente-viagere-restit/rachat-rente-viagere-restit.component';
import {RachatRenteviagereInfobullesResolve} from './rachat-rente-viagere-infobulles-resolve';

const routes: Routes = [{
  path: 'rachat-rente-viagere',
  component: TwoColumnsLayoutComponent,
  children: [
    {path: '', component: RachatRenteViagereRestitComponent, outlet: 'result'},
    {path: '', component: RachatRenteViagereCalculComponent},
  ],
  resolve: {
    infoBulles: RachatRenteviagereInfobullesResolve,
  },
  data: {
    title: '{{rachatRenteViagere}}',
    breadcrumb: [
      {
        label: '{{accueil}}',
        url: '/',
      },
      {
        label: '{{rachatRenteViagere}}',
        url: '',
      },
    ],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RachatRenteViagereRoutingModule {
}
