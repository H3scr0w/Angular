import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from '@core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { websiteReducer } from '../../core/webconsole/website.reducer';
import { DrupalDocrootCoreService } from '../../shared/services/drupaldocrootcore.service';
import { RepositoryService } from '../../shared/services/repository.service';
import { RequestService } from '../../shared/services/request.service';
import { WebsiteService } from '../../shared/services/website.service';
import { NewRequestComponent } from './new-request.component';

describe('NewRequestComponent', () => {
  let component: NewRequestComponent;
  let fixture: ComponentFixture<NewRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewRequestComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
          website: websiteReducer
        })
      ],
      providers: [
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        WebsiteService,
        DrupalDocrootCoreService,
        RepositoryService,
        RequestService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
