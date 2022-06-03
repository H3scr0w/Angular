import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentionsLegalesComponent } from './mentions-legales.component';
import { MentionsLegalesRoutingModule } from './mentions-legales-routing.module';
import {TranslateModule} from '@ngx-translate/core';



@NgModule({
  declarations: [MentionsLegalesComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MentionsLegalesRoutingModule,
  ],
})
export class MentionsLegalesModule { }
