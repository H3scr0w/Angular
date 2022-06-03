import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaEventsComponent } from './incapsula-events.component';

describe('IncapsulaEventsComponent', () => {
  let component: IncapsulaEventsComponent;
  let fixture: ComponentFixture<IncapsulaEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaEventsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
