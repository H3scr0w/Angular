import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatsBackdoorComponent } from './threats-backdoor.component';

describe('ThreatsBackdoorComponent', () => {
  let component: ThreatsBackdoorComponent;
  let fixture: ComponentFixture<ThreatsBackdoorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreatsBackdoorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsBackdoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
