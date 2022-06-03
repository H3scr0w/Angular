import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TextAreaInputComponent} from './text-area-input.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpLoaderFactory} from '../../../../../app.module';
import {HttpClient} from '@angular/common/http';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Constants} from '../../../../constants';

describe('NumberInputComponent', () => {
  let component: TextAreaInputComponent;
  let fixture: ComponentFixture<TextAreaInputComponent>;
  let valeurBien: FormControl;
  let fg: FormGroup;

  beforeEach(async(() => {
    valeurBien = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.min(1), Validators.pattern(Constants.patternNumber)]);
    fg = new FormGroup({
      valeur_bien: valeurBien,
    });
    const fgd: FormGroupDirective = new FormGroupDirective([], []);
    fgd.form = fg;
    TestBed.configureTestingModule({
      declarations: [ TextAreaInputComponent ],
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
    }).overrideComponent(TextAreaInputComponent, {
      set: {
        viewProviders: [
          { provide: ControlContainer, useValue: fgd },
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaInputComponent);
    component = fixture.componentInstance;
    component.labelId = 'valeur_bien';
    component.inputCtrl = valeurBien;
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
