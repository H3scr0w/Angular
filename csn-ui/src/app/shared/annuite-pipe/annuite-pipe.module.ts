import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnuitePipe} from './annuite.pipe';

@NgModule({
  declarations: [AnnuitePipe],
  imports: [
    CommonModule,
  ],
  exports: [
    AnnuitePipe,
  ],
})
export class AnnuitePipeModule { }
