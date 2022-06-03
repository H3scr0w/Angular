import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nService } from '@core';
import { SpinnerService } from '@delivery/stgo-common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { MockAuthenticationService } from '../authentication/authentication.service.mock';
import { CoreModule } from '../core.module';
import { MockI18Service } from '../i18n/i18n.service.mock';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, RouterTestingModule, TranslateModule.forRoot(), CoreModule],
      providers: [
        SpinnerService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: I18nService, useClass: MockI18Service },
        { provide: 'toolboxUrl', useValue: '' },
        { provide: 'toolboxApplicationPath', useValue: '' }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
