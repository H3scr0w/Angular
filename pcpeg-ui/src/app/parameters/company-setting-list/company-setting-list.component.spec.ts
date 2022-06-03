import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySettingListComponent } from './company-setting-list.component';

describe('CompanySettingListComponent', () => {
  let component: CompanySettingListComponent;
  let fixture: ComponentFixture<CompanySettingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanySettingListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
