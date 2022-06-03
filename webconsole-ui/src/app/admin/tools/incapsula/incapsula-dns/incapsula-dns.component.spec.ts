import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaDnsComponent } from './incapsula-dns.component';

describe('IncapsulaDnsComponent', () => {
  let component: IncapsulaDnsComponent;
  let fixture: ComponentFixture<IncapsulaDnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaDnsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaDnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
