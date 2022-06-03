import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogService } from './../../shared/service/catalog/catalog.service';
import { MockCatalogService } from './../../shared/service/catalog/catalog.service.mock';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from '../../shared/service/message/message.service';
import { MockMessageService } from '../../shared/service/message/message.service.mock';
import { SharedModule } from '../../shared/shared.module';
import { CatalogImportComponent } from './catalog-import.component';

describe('CatalogImportComponent', () => {
  let component: CatalogImportComponent;
  let fixture: ComponentFixture<CatalogImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: MessageService, useClass: MockMessageService }
      ],
      declarations: [CatalogImportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
