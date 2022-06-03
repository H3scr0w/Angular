import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerRecordComponent } from './serverrecord.component';

describe('ServerrecordComponent', () => {
  let component: ServerRecordComponent;
  let fixture: ComponentFixture<ServerRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServerRecordComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
