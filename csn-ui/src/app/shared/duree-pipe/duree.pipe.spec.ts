import {DureePipe} from './duree.pipe';
import {async, inject, TestBed} from '@angular/core/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DureeType} from '../enums';

declare let readJSON: any;

export class TranslateCustomLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const frFR = readJSON('../../../../assets/i18n/fr-FR.json');
    return of(frFR);
  }
}

describe('DureePipe', () => {
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
    const pipe = new DureePipe(translateService);
    expect(pipe).toBeTruthy();
  })));
  it ('should return value', (inject([TranslateService], (service: TranslateService) => {
    translateService = service;
    translateService.use('fr-FR');
    const pipe = new DureePipe(translateService);
    const result = pipe.transform(23.58, DureeType.ANNEE, false);
    expect(result).toBe('23 années et 7 mois');
  })));
});
