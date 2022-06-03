import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { setUpTestBed } from '../test.common.spec';
import { AppComponent } from './app.component';

fdescribe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  setUpTestBed({
    imports: [
      RouterTestingModule.withRoutes([]),
      BrowserModule,
      BrowserAnimationsModule,
      SharedModule,
      CoreModule,
      HttpClientTestingModule
    ],
    declarations: [AppComponent],
    providers: []
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', fakeAsync(() => {
    tick();
    expect(component).toBeTruthy();
  }));
});
