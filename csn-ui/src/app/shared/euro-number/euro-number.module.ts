import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EuroNumberPipe } from './euro-number.pipe';



@NgModule({
  declarations: [EuroNumberPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    EuroNumberPipe,
  ],
})
export class EuroNumberModule { }
