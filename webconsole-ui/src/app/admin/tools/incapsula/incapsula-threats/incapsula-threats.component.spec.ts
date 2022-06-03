import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaThreatsComponent } from './incapsula-threats.component';

describe('IncapsulaThreatsComponent', () => {
  let component: IncapsulaThreatsComponent;
  let fixture: ComponentFixture<IncapsulaThreatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaThreatsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaThreatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
