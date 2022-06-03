import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PercentWithoutSignPipe} from './percent-without-sign.pipe';

@NgModule({
  declarations: [PercentWithoutSignPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    PercentWithoutSignPipe,
  ],
})
export class PercentWithoutSignModule { }
