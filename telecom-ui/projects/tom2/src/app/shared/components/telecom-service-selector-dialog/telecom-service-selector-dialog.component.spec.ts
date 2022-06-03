import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared.module';
import { TelecomServiceSelectorDialogComponent } from './telecom-service-selector-dialog.component';

class MatDialogRefStub {
  close() {}
}

describe('TelecomServiceSelectorDialogComponent', () => {
  let component: TelecomServiceSelectorDialogComponent;
  let fixture: ComponentFixture<TelecomServiceSelectorDialogComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TelecomServiceSelectorDialogComponent],
      imports: [BrowserAnimationsModule, SharedModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: MatDialog, useValue: matDialogRefStub },
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA },
        MatSnackBar
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecomServiceSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
