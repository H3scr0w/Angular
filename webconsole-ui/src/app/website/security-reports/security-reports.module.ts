import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SecurityReportsRoutingModule } from './security-reports-routing.module';
import { SecurityReportsComponent } from './security-reports.component';

@NgModule({
  imports: [CommonModule, SharedModule, SecurityReportsRoutingModule],
  declarations: [SecurityReportsComponent]
})
export class SecurityReportsModule {}
