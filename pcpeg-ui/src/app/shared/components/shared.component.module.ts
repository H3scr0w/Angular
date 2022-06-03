import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DocumentDialogComponent } from './document-dialog/document-dialog.component';
import { FacilitySettingDialogComponent } from './facility-setting-dialog/facility-setting-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FundDialogComponent } from './fund-dialog/fund-dialog.component';
import { FundSettingDialogComponent } from './fund-setting-dialog/fund-setting-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    UserDialogComponent,
    DocumentDialogComponent,
    FundDialogComponent,
    FileUploadComponent,
    FundSettingDialogComponent,
    FacilitySettingDialogComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    NgSelectModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatRadioModule
  ],
  exports: [FileUploadComponent]
})
export class SharedComponentModule {}
