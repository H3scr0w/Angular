import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { NewRequestRoutingModule } from './new-request-routing.module';
import { NewRequestComponent } from './new-request.component';

@NgModule({
  imports: [CommonModule, SharedModule, NewRequestRoutingModule],
  declarations: [NewRequestComponent]
})
export class NewRequestModule {}
