import {NgModule} from '@angular/core';
import {InfoBulleComponent} from '../shared/components/info-bulle/info-bulle.component';
import {ModalModule, PopoverModule} from 'ngx-bootstrap';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [InfoBulleComponent],
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
  ],
  exports: [
    InfoBulleComponent,
  ],
})
export class InfobulleModule { }
