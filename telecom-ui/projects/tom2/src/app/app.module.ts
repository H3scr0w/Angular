import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { environment } from '@env/environment';
import { SharedModule } from '@shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { NotAuthorizeModule } from './not-authorize/not-authorize.module';

/**
 * The Application module
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    CoreModule,
    SharedModule,
    HomeModule,
    NotAuthorizeModule,
    AppRoutingModule
  ],
  declarations: [AppComponent],
  providers: [
    { provide: 'toolboxUrl', useValue: environment.toolboxUrl },
    { provide: 'toolboxApplicationPath', useValue: environment.toolboxApplicationPath }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
