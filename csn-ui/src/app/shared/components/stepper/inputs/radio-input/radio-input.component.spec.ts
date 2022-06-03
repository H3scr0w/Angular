import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RadioInputComponent} from './radio-input.component';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../../../app.module';
import {HttpClient} from '@angular/common/http';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<RadioInputComponent>;
  let valeurLocative: FormControl;
  let fg: FormGroup;

  beforeEach(async(() => {
    valeurLocative = new FormControl({ value: '', disabled: true },
      Validators.required);
    fg = new FormGroup({
      valeur_locative: valeurLocative,
    });
    const fgd: FormGroupDirective = new FormGroupDirective([], []);
    fgd.form = fg;
    TestBed.configureTestingModule({
      declarations: [ RadioInputComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        ReactiveFormsModule,
      ],
      providers: [ FormGroupDirective,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(RadioInputComponent, {
      set: {
        viewProviders: [
          { provide: ControlContainer, useValue: fgd },
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioInputComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
