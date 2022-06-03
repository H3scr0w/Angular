import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureConfigurationComponent } from './infrastructure-configuration.component';

describe('InfrastructureConfigurationComponent', () => {
  let component: InfrastructureConfigurationComponent;
  let fixture: ComponentFixture<InfrastructureConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfrastructureConfigurationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
