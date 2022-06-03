import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapsulaSiteConfComponent } from './incapsula-site-conf.component';

describe('IncapsulaSiteConfComponent', () => {
  let component: IncapsulaSiteConfComponent;
  let fixture: ComponentFixture<IncapsulaSiteConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncapsulaSiteConfComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapsulaSiteConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
