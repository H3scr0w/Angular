import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { InitAccountRoutingModule } from './init-account-routing.module';
import { InitAccountComponent } from './view/init-account.component';

@NgModule({
  imports: [CommonModule, TranslateModule.forChild(), InitAccountRoutingModule],
  declarations: [InitAccountComponent]
})
export class InitAccountModule {}
