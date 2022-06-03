import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MentionsLegalesComponent} from './mentions-legales.component';
import { OneColumnLayoutComponent } from 'src/app/layout/one-column-layout/one-column-layout.component';

const routes: Routes = [{
  path: 'mentions-legales',
  component: OneColumnLayoutComponent,
  children: [
    {path: '', component: MentionsLegalesComponent},
  ],
  data: {
    title: '{{mentionsLegales}}',
    breadcrumb: [
      {
        label: '{{accueil}}',
        url: '/',
      },
      {
        label: '{{mentionsLegales}}',
        url: '',
      },
    ],
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MentionsLegalesRoutingModule {
}
