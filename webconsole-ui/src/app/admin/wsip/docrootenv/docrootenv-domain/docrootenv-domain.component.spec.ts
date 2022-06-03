import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocrootenvDomainComponent } from './docrootenv-domain.component';

describe('DocrootenvDomainComponent', () => {
  let component: DocrootenvDomainComponent;
  let fixture: ComponentFixture<DocrootenvDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocrootenvDomainComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocrootenvDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
