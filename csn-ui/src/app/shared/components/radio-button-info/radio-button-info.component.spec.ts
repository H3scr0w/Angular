import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonInfoComponent } from './radio-button-info.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('RadioButtonInfoComponent', () => {
  let component: RadioButtonInfoComponent;
  let fixture: ComponentFixture<RadioButtonInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadioButtonInfoComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioButtonInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
