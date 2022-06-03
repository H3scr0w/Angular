import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedModule } from '@shared';
import { CacheModeComponent } from './cache-mode.component';

describe('CacheModeComponent', () => {
  let component: CacheModeComponent;
  let fixture: ComponentFixture<CacheModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [CacheModeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
