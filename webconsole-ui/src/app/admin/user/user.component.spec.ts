import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';

import { UserComponent } from './user.component';

describe('UserComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), BrowserAnimationsModule, SharedModule, CoreModule],
      declarations: [UserComponent]
    }).compileComponents();
  });
});
