import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared';
import { ThreatsDdosComponent } from './threats-ddos.component';

describe('ThreatsDdosComponent', () => {
  let component: ThreatsDdosComponent;
  let fixture: ComponentFixture<ThreatsDdosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ThreatsDdosComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreatsDdosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
