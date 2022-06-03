import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

/**
 * The routes
 */
const routes: Routes = [
  {
    path: '',
    component: EmailTemplatesComponent,
    pathMatch: 'full',
    data: { title: 'Email templates' }
  }
];

/**
 * The email template routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmailTemplatesRoutingModule {}
