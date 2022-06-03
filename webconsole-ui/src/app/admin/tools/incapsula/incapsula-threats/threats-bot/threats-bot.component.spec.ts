import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatsBotComponent } from './threats-bot.component';

describe('ThreatsBotComponent', () => {
  let component: ThreatsBotComponent;
  let fixture: ComponentFixture<ThreatsBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreatsBotComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
