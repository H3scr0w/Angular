import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DureeSelectInputComponent } from './duree-select-input.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../../../app.module';
import {HttpClient} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DureeSelectInputComponent', () => {
  let component: DureeSelectInputComponent;
  let fixture: ComponentFixture<DureeSelectInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [ DureeSelectInputComponent ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DureeSelectInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
