import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupGuard } from '../shared/guards/user-group.guard';
import { BulkSiteListComponent } from './bulk-site/bulk-site-list/bulk-site-list.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { ContactListComponent } from './contact/contact-list/contact-list.component';
import { MailingListComponent } from './mailing/mailing-list/mailing-list.component';
import { SiteListComponent } from './site/site-list/site-list.component';

/**
 * The routes
 */
const routes: Routes = [
  { path: '', redirectTo: 'site', pathMatch: 'full' },
  {
    path: 'site',
    component: SiteListComponent,
    pathMatch: 'full',
    data: { title: 'Site' }
  },
  {
    path: 'site/:siteCode',
    component: SiteListComponent,
    pathMatch: 'full',
    data: { title: 'Site' }
  },
  {
    path: 'mailing-list',
    component: MailingListComponent,
    pathMatch: 'full',
    data: { title: 'Mailing List' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'company',
    component: CompanyListComponent,
    pathMatch: 'full',
    data: { title: 'Company' }
  },
  {
    path: 'company/:sifCode',
    component: CompanyListComponent,
    pathMatch: 'full',
    data: { title: 'Company' }
  },
  {
    path: 'contact',
    component: ContactListComponent,
    pathMatch: 'full',
    data: { title: 'Contact' }
  },
  {
    path: 'bulk-site',
    component: BulkSiteListComponent,
    pathMatch: 'full',
    data: { title: 'Bulk Modification' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefinitionRoutingModule {}
