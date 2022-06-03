import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettingStepperComponent } from './company-setting-stepper.component';

describe('CompanySettingStepperComponent', () => {
  let component: CompanySettingStepperComponent;
  let fixture: ComponentFixture<CompanySettingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanySettingStepperComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySettingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
