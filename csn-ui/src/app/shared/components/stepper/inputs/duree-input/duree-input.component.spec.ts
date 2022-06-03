import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DureeInputComponent} from './duree-input.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../../../app.module';
import {HttpClient} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('DureeInputComponent', () => {
  let component: DureeInputComponent;
  let fixture: ComponentFixture<DureeInputComponent>;

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
      declarations: [DureeInputComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DureeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
