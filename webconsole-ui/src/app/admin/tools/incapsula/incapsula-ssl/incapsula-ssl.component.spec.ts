import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaSslComponent } from './incapsula-ssl.component';

describe('IncapsulaSslComponent', () => {
  let component: IncapsulaSslComponent;
  let fixture: ComponentFixture<IncapsulaSslComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaSslComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaSslComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
