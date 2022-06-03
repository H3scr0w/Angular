import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteEnvironmentComponent } from './website-environment.component';

describe('WebsiteEnvironmentComponent', () => {
  let component: WebsiteEnvironmentComponent;
  let fixture: ComponentFixture<WebsiteEnvironmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsiteEnvironmentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
