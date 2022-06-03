import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsipProjectComponent } from './wsip-project.component';

describe('WsipProjectComponent', () => {
  let component: WsipProjectComponent;
  let fixture: ComponentFixture<WsipProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WsipProjectComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WsipProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
