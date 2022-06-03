import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OperatorsService } from './../../shared/service/operators/operators.service';

import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared';
import { CatalogService } from '../../shared/service/catalog/catalog.service';
import { MockCatalogService } from '../../shared/service/catalog/catalog.service.mock';
import { MockOperatorsService } from '../../shared/service/operators/operators.service.mock';
import { CatalogExportComponent } from './catalog-export.component';

class MatDialogRefStub {
  close() {}
}

describe('CatalogExportComponent', () => {
  let component: CatalogExportComponent;
  let fixture: ComponentFixture<CatalogExportComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      declarations: [CatalogExportComponent],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: MatDialogRef, useValue: matDialogRefStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
