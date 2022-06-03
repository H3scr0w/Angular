import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaSiteComponent } from './incapsula-site.component';

describe('IncapsulaSiteComponent', () => {
  let component: IncapsulaSiteComponent;
  let fixture: ComponentFixture<IncapsulaSiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaSiteComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
