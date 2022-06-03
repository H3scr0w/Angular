import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocrootenvLoadbalancerComponent } from './docrootenv-loadbalancer.component';

describe('DocrootenvLoadbalancerComponent', () => {
  let component: DocrootenvLoadbalancerComponent;
  let fixture: ComponentFixture<DocrootenvLoadbalancerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocrootenvLoadbalancerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocrootenvLoadbalancerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
