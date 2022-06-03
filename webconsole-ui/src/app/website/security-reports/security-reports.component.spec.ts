import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityReportsComponent } from './security-reports.component';

describe('SecurityReportsComponent', () => {
  let component: SecurityReportsComponent;
  let fixture: ComponentFixture<SecurityReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecurityReportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
