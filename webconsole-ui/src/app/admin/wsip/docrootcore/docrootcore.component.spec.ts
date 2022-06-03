import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { DocrootcoreComponent } from './docrootcore.component';

describe('DocrootcoreComponent', () => {
  let component: DocrootcoreComponent;
  let fixture: ComponentFixture<DocrootcoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule, CoreModule],
      declarations: [DocrootcoreComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocrootcoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
