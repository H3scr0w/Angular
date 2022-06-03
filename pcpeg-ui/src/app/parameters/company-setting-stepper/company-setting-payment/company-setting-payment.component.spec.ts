import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettingPaymentComponent } from './company-setting-payment.component';

describe('CompanySettingPaymentComponent', () => {
  let component: CompanySettingPaymentComponent;
  let fixture: ComponentFixture<CompanySettingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanySettingPaymentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySettingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
