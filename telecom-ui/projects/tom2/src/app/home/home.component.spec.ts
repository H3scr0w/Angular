import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared';
import { setUpTestBed } from '../../test.common.spec';
import { MockAuthenticationService } from '../core/authentication/authentication.service.mock';
import { HomeComponent } from './home.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[translateParams]'
})
export class TranslateParamsStubDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('translateParams')
  translateParams: any;
}
describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  setUpTestBed({
    imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
    declarations: [HomeComponent, TranslateParamsStubDirective],
    providers: [{ provide: AuthenticationService, useClass: MockAuthenticationService }]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
