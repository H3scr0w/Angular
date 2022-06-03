import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatsBlockComponent } from './threats-block.component';

describe('ThreatsBlockComponent', () => {
  let component: ThreatsBlockComponent;
  let fixture: ComponentFixture<ThreatsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreatsBlockComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
