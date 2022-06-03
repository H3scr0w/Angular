import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDisplayComponent } from './contact-display.component';

describe('ContactDisplayComponent', () => {
  let component: ContactDisplayComponent;
  let fixture: ComponentFixture<ContactDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactDisplayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
