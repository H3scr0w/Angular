import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DateInputComponent} from './date-input.component';
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

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<DateInputComponent>;
  let dateContrat: FormControl;
  let fg: FormGroup;
  beforeEach(async(() => {
    dateContrat = new FormControl({ value: '', disabled: true },
      [Validators.required, Validators.pattern(Constants.patternDate)]);
    fg = new FormGroup({
      date_contrat: dateContrat,
    });
    const fgd: FormGroupDirective = new FormGroupDirective([], []);
    fgd.form = fg;
    TestBed.configureTestingModule({
      declarations: [ DateInputComponent ],
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
    }).overrideComponent(DateInputComponent, {
      set: {
        viewProviders: [
          { provide: ControlContainer, useValue: fgd },
        ],
      },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputComponent);
    component = fixture.componentInstance;
    component.labelId = 'date_contrat';
    component.inputCtrl = dateContrat;
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
