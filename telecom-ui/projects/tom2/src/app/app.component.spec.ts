import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StgoCommonModule } from '@delivery/stgo-common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { setUpTestBed } from '../test.common.spec';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  setUpTestBed({
    imports: [RouterTestingModule, TranslateModule.forRoot(), CoreModule, StgoCommonModule],
    declarations: [AppComponent],
    providers: []
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));
});
