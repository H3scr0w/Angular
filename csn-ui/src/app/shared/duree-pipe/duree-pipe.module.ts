import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DureePipe} from './duree.pipe';

@NgModule({
  declarations: [DureePipe],
  imports: [
    CommonModule,
  ],
  exports: [
    DureePipe,
  ],
})
export class DureePipeModule { }
