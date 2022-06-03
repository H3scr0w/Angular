import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { StgoFormModule } from '../forms/forms.module';
import { CatalogOptionsAddComponent } from './catalog-option-add/catalog-option-add.component';
import { ChargebackAddComponent } from './chargeback-add/chargeback-add.component';
import { ChargebackSelectComponent } from './chargeback-select/chargeback-select.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactSelectorComponent } from './contact-selector/contact-selector.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FinancialInformationComponent } from './financial-information/financial-information.component';
import { InformationItemsComponent } from './information-items/information-items.component';
import { IspInformationComponent } from './isp-information/isp-information.component';
import { OperatorInformationComponent } from './operator-information/operator-information.component';
import { OptionsCatalogComponent } from './options-catalog/options-catalog.component';
import { SiteInfoComponent } from './site-info/site-info.component';
import { SlaInformationComponent } from './sla-information/sla-information.component';
import { TelecomServiceDetailsComponent } from './telecom-service-details/telecom-service-details.component';
import { TelecomServiceSelectorComponent } from './telecom-service-selector/telecom-service-selector.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    FileUploadComponent,
    TelecomServiceSelectorComponent,
    SiteInfoComponent,
    TelecomServiceDetailsComponent,
    ContactSelectorComponent,
    SlaInformationComponent,
    FinancialInformationComponent,
    InformationItemsComponent,
    OperatorInformationComponent,
    IspInformationComponent,
    OptionsCatalogComponent,
    ChargebackSelectComponent,
    ChargebackAddComponent,
    CatalogOptionsAddComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule,
    NgSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    StgoFormModule
  ],
  exports: [
    FileUploadComponent,
    TelecomServiceSelectorComponent,
    SiteInfoComponent,
    TelecomServiceDetailsComponent,
    ContactSelectorComponent,
    SlaInformationComponent,
    FinancialInformationComponent,
    InformationItemsComponent,
    OperatorInformationComponent,
    IspInformationComponent,
    OptionsCatalogComponent,
    CatalogOptionsAddComponent,
    MatSlideToggleModule,
    StgoFormModule
  ]
})
export class SharedComponentModule {}
