import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ReinitPasswordRoutingModule } from './reinit-password-routing.module';
import { ReinitPasswordComponent } from './view/reinit-password.component';

@NgModule({
  imports: [CommonModule, TranslateModule.forChild(), ReinitPasswordRoutingModule],
  declarations: [ReinitPasswordComponent]
})
export class ReinitPasswordModule {}
