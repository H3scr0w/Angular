import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettingAuthorityComponent } from './company-setting-authority.component';

describe('CompanySettingAuthorityComponent', () => {
  let component: CompanySettingAuthorityComponent;
  let fixture: ComponentFixture<CompanySettingAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanySettingAuthorityComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySettingAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
