import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../core';
import { MockAuthenticationService } from '../../core/authentication/authentication.service.mock';
import { SharedModule } from '../../shared';
import { CatalogService } from '../../shared/service/catalog/catalog.service';
import { MockCatalogService } from '../../shared/service/catalog/catalog.service.mock';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { OperatorsService } from '../../shared/service/operators/operators.service';
import { MockOperatorsService } from '../../shared/service/operators/operators.service.mock';
import { CatalogActivateComponent } from './catalog-activate.component';

describe('CatalogActivateComponent', () => {
  let component: CatalogActivateComponent;
  let fixture: ComponentFixture<CatalogActivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: AuthenticationService, useClass: MockAuthenticationService }
      ],
      declarations: [CatalogActivateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
