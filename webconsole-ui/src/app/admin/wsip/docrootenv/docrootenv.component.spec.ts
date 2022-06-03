import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { DocrootenvComponent } from './docrootenv.component';

describe('DocrootenvComponent', () => {
  let component: DocrootenvComponent;
  let fixture: ComponentFixture<DocrootenvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, BrowserAnimationsModule, CoreModule],
      declarations: [DocrootenvComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocrootenvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
