import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContactDisplayComponent } from './contact-display/contact-display.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [ConfirmationDialogComponent, ContactDisplayComponent, FileUploadComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule
  ],
  exports: [ContactDisplayComponent, FileUploadComponent]
})
export class SharedComponentModule {}
