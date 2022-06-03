import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WarningMessageModalComponent} from './warning-message-modal.component';
import {ModalModule} from 'ngx-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [WarningMessageModalComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TranslateModule,
  ],
  exports: [
    WarningMessageModalComponent,
  ],
})
export class WarningMessageModalModule {
}
