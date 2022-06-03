import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@shared';
import { HelpRoutingModule } from './help-routing.module';
import { UserManualComponent } from './user-manual/user-manual.component';

@NgModule({
  declarations: [UserManualComponent],
  imports: [CommonModule, SharedModule, TranslateModule, HelpRoutingModule]
})
export class HelpModule {}
