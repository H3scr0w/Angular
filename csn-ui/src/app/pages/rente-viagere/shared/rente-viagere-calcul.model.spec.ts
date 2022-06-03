import {RenteViagereCalcul} from './rente-viagere-calcul.model';
import {Credirentier} from './credirentier.model';
import {TestBed} from '@angular/core/testing';

describe('RenteViagereCalcul', () => {
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
    expect(new RenteViagereCalcul('2019-01-01', 'true', 500000,
      100000, 1000, 3000, credirentiers, 12,
      'ECHU', '', '')).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
