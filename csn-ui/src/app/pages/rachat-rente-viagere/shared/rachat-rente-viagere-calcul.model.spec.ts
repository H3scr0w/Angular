import {RachatRenteViagereCalcul} from './rachat-rente-viagere-calcul.model';
import {Credirentier} from '../../rente-viagere/shared/credirentier.model';
import {TestBed} from '@angular/core/testing';

describe('RachatRenteViagereCalcul', () => {
  it('should create an instance', () => {
    const credirentiers: Credirentier[] = [];
    let credirentier = new Credirentier();
    credirentier.sexe = 'HOMME';
    credirentier.date_naissance = new Date();
    credirentiers.push(credirentier);

    credirentier = new Credirentier();
    credirentier.sexe = 'FEMME';
    credirentier.date_naissance = new Date();
    credirentiers.push(credirentier);
    expect(new RachatRenteViagereCalcul('2019-01-01', '2019-01-01',
      'OCCUPE', 300000, 2, 2000,
      credirentiers, 12, '', '')).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
