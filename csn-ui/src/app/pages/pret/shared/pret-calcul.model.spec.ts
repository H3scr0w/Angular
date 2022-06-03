import {PretCalcul} from './pret-calcul.model';
import {TestBed} from '@angular/core/testing';
import {DureeType, TypesCalcul, TypesTableauAmortissement} from '../../../shared/enums';

describe('PretCalcul', () => {
  it('should create an instance', () => {
    expect(new PretCalcul('IMMOBILIER', 20000, TypesCalcul.DUREE, TypesTableauAmortissement.AVEC_DATE,
      2, 2, DureeType.ANNEE,
      1000, 10, 10, '2000-01-01', '2000-01-01',
      12, 'CONSTANT', '', '')).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
