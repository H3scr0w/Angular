import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [ConfirmationDialogComponent, FileUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule
  ],
  exports: [FileUploadComponent]
})
export class SharedComponentModule {}
