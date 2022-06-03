import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../..';
import { CatalogOptionsAddComponent } from './catalog-option-add.component';

class MatDialogRefStub {
  close() {}
}

describe('CatalogOptionsAddComponent', () => {
  let component: CatalogOptionsAddComponent;
  let fixture: ComponentFixture<CatalogOptionsAddComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: matDialogRefStub }, { provide: MAT_DIALOG_DATA }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogOptionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
