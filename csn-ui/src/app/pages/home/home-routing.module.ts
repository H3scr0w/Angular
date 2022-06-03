import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { OneColumnLayoutComponent } from '../../layout/one-column-layout/one-column-layout.component';

const routes: Routes = [
  {
    path: '',
    component: OneColumnLayoutComponent,
    children: [
      {path: '', component: HomeComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
