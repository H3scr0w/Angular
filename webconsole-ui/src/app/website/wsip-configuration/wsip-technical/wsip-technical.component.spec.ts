import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsipTechnicalComponent } from './wsip-technical.component';

describe('WsipTechnicalComponent', () => {
  let component: WsipTechnicalComponent;
  let fixture: ComponentFixture<WsipTechnicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WsipTechnicalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WsipTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
