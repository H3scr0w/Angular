import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { CatalogActivateComponent } from './catalog-activate/catalog-activate.component';
import { CatalogExportComponent } from './catalog-export/catalog-export.component';
import { CatalogImportComponent } from './catalog-import/catalog-import.component';
import { CatalogsRoutingModule } from './catalogs-routing.module';

@NgModule({
  declarations: [CatalogImportComponent, CatalogExportComponent, CatalogActivateComponent],
  imports: [CommonModule, CatalogsRoutingModule, SharedModule, TranslateModule]
})
export class CatalogsModule {}
