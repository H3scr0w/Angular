import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModalModule} from 'ngx-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {ModalInfoBulleComponent} from './modal-info-bulle.component';

@NgModule({
  declarations: [ModalInfoBulleComponent],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TranslateModule,
  ],
  exports: [
    ModalInfoBulleComponent,
  ],
})
export class ModalInfoBulleModule {
}
