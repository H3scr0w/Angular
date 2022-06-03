import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { QuillModule } from 'ngx-quill';
import { EmailTemplatesRoutingModule } from './email-templates-routing.module';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

@NgModule({
  declarations: [EmailTemplatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    EmailTemplatesRoutingModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          container: [['bold', 'italic', 'underline'], [{ color: [] }]]
        }
      }
    }),
    MatDatepickerModule
  ]
})
export class EmailTemplatesModule {}
