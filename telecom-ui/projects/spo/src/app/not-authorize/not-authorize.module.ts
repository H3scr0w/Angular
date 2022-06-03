import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { NotAuthorizeRoutingModule } from './not-authorize-routing.module';
import { NotAuthorizeComponent } from './not-authorize.component';

@NgModule({
  imports: [CommonModule, TranslateModule, NotAuthorizeRoutingModule, MatCardModule],
  declarations: [NotAuthorizeComponent]
})
export class NotAuthorizeModule {}
