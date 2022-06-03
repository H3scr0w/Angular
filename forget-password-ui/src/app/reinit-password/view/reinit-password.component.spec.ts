import { ComponentFixture, TestBed } from '@angular/core/testing';
import { I18nService } from '@app/core';
import { environment } from '@env/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { setUpTestBed } from 'test.common.spec';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';
import { ReinitPasswordComponent } from './reinit-password.component';

describe('ReinitPasswordComponent', () => {
  let component: ReinitPasswordComponent;
  let fixture: ComponentFixture<ReinitPasswordComponent>;
  let i18nService: I18nService;

  setUpTestBed({
    declarations: [ReinitPasswordComponent, RouterLinkStubDirective],
    imports: [TranslateModule.forRoot()],
    providers: [TranslateService, I18nService]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinitPasswordComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.get(I18nService);
    i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
