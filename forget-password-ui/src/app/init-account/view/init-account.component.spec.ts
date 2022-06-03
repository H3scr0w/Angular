import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { InitAccountComponent } from './init-account.component';

describe('InitAccountComponent', () => {
  let component: InitAccountComponent;
  let fixture: ComponentFixture<InitAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InitAccountComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
