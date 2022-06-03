import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupGuard } from './../shared/guards/user-group.guard';
import { CatalogActivateComponent } from './catalog-activate/catalog-activate.component';
import { CatalogExportComponent } from './catalog-export/catalog-export.component';
import { CatalogImportComponent } from './catalog-import/catalog-import.component';

const routes: Routes = [
  { path: '', redirectTo: 'export', pathMatch: 'full' },
  {
    path: 'export',
    component: CatalogExportComponent,
    pathMatch: 'full',
    data: { title: 'Catalogs' }
  },
  {
    path: 'import',
    component: CatalogImportComponent,
    pathMatch: 'full',
    data: { title: 'Catalogs' },
    canActivate: [UserGroupGuard]
  },
  {
    path: 'activate',
    component: CatalogActivateComponent,
    pathMatch: 'full',
    data: { title: 'Activate Catalogs' },
    canActivate: [UserGroupGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule {}
