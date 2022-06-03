import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { setUpTestBed } from 'test.common.spec';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordReducer } from '@app/core/password/password.reducer';
import { StoreModule } from '@ngrx/store';
import { ActivatedRouteStub, RouterStub } from '../../../testing/router-stubs';
import { NewPasswordComponent } from './new-password.component';

describe('NewPasswordComponent', () => {
  let component: NewPasswordComponent;
  let fixture: ComponentFixture<NewPasswordComponent>;

  setUpTestBed({
    declarations: [NewPasswordComponent],
    imports: [
      TranslateModule.forRoot(),
      ReactiveFormsModule,
      HttpClientTestingModule,
      TranslateModule.forRoot(),
      StoreModule.forRoot({
        password: passwordReducer
      })
    ],
    providers: [{ provide: Router, useClass: RouterStub }, { provide: ActivatedRoute, useClass: ActivatedRouteStub }]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
