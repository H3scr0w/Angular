import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { ProfileInformationComponent } from './profile-information/profile-information.component';
import { ProfileProjectComponent } from './profile-project/profile-project.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent, ProfileInformationComponent, ProfileProjectComponent],
  imports: [CommonModule, SharedModule, ProfileRoutingModule]
})
export class ProfileModule {}
