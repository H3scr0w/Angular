import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebappauthrecordComponent } from './webappauthrecord.component';

describe('WebappauthrecordComponent', () => {
  let component: WebappauthrecordComponent;
  let fixture: ComponentFixture<WebappauthrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebappauthrecordComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebappauthrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
