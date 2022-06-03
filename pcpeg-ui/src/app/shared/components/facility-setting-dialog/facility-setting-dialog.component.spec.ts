import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitySettingDialogComponent } from './facility-setting-dialog.component';

describe('FacilitySettingDialogComponent', () => {
  let component: FacilitySettingDialogComponent;
  let fixture: ComponentFixture<FacilitySettingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacilitySettingDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitySettingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
