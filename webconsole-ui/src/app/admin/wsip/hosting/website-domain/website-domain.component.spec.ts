import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDomainComponent } from './website-domain.component';

describe('WebsiteDomainComponent', () => {
  let component: WebsiteDomainComponent;
  let fixture: ComponentFixture<WebsiteDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebsiteDomainComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
