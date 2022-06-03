import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostingProviderComponent } from './hosting-provider.component';

describe('HostingProviderComponent', () => {
  let component: HostingProviderComponent;
  let fixture: ComponentFixture<HostingProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostingProviderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostingProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
