import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { of } from 'rxjs';

import { UserService } from '../../../shared/services/user.service';
import { RightsComponent } from './rights.component';

describe('RightsComponent', () => {
  let component: RightsComponent;
  let fixture: ComponentFixture<RightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, CoreModule, BrowserAnimationsModule],
      declarations: [RightsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (email: string) => 'test@test.com' })
          }
        },
        UserService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
