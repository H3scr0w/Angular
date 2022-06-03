import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { TranslateModule } from '@ngx-translate/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    HomeRoutingModule,
    TranslateModule,
    NgxSpinnerModule,
    CommonModule,
  ],
  declarations: [HomeComponent],
})
export class HomeModule {
}
