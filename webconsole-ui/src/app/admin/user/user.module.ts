import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { EditUserComponent } from './dialog/edit-user/edit-user.component';
import { AddRightComponent } from './rights/dialog/add-right/add-right.component';
import { DeleteRightComponent } from './rights/dialog/delete-right/delete-right.component';
import { RightsComponent } from './rights/rights.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent, EditUserComponent, RightsComponent, AddRightComponent, DeleteRightComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule]
})
export class UserModule {}
