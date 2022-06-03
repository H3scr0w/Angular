import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaIncidentsComponent } from './incapsula-incidents.component';

describe('IncapsulaIncidentsComponent', () => {
  let component: IncapsulaIncidentsComponent;
  let fixture: ComponentFixture<IncapsulaIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaIncidentsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
