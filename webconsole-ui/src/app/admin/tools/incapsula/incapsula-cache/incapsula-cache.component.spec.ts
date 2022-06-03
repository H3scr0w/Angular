import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaCacheComponent } from './incapsula-cache.component';

describe('IncapsulaCacheComponent', () => {
  let component: IncapsulaCacheComponent;
  let fixture: ComponentFixture<IncapsulaCacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaCacheComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
