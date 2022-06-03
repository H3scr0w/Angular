import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NewPasswordRoutingModule } from './new-password-routing.module';
import { NewPasswordComponent } from './view/new-password.component';

@NgModule({
  imports: [CommonModule, TranslateModule.forChild(), ReactiveFormsModule, NewPasswordRoutingModule],
  declarations: [NewPasswordComponent]
})
export class NewPasswordModule {}
