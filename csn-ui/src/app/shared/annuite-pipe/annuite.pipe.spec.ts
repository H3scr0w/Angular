import {AnnuitePipe} from './annuite.pipe';
import {async, inject, TestBed} from '@angular/core/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable, of} from 'rxjs';

declare let readJSON: any;

export class TranslateCustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const frFR = readJSON('../../../../assets/i18n/fr-FR.json');
    return of(frFR);
  }
}

describe('AnnuitePipe', () => {
  let translateService: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader, useClass: TranslateCustomLoader,
          },
        }),

      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));
  it('create an instance', (inject([TranslateService], (service: TranslateService) => {
    translateService = service;
    translateService.use('fr-FR');
    const pipe = new AnnuitePipe(translateService);
    expect(pipe).toBeTruthy();
  })));
  it ('should return value', (inject([TranslateService], (service: TranslateService) => {
    translateService = service;
    translateService.use('fr-FR');
    const pipe = new AnnuitePipe(translateService);
    let result = pipe.transform(12);
    expect(result).toBe('Mensualité');

    result = pipe.transform(4);
    expect(result).toBe('Trimestrialité');

    result = pipe.transform(2);
    expect(result).toBe('Semestrialité');

    result = pipe.transform(1);
    expect(result).toBe('Annuité');
  })));
});
