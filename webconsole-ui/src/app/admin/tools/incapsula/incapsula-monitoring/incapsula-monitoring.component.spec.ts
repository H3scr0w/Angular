import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaMonitoringComponent } from './incapsula-monitoring.component';

describe('IncapsulaMonitoringComponent', () => {
  let component: IncapsulaMonitoringComponent;
  let fixture: ComponentFixture<IncapsulaMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaMonitoringComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
