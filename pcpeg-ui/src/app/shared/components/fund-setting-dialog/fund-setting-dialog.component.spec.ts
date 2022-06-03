import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundSettingDialogComponent } from './fund-setting-dialog.component';

describe('FundSettingDialogComponent', () => {
  let component: FundSettingDialogComponent;
  let fixture: ComponentFixture<FundSettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FundSettingDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundSettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
