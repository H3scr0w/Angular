import {RefinancementPretCalcul} from './refinancement-pret-calcul.model';
import {TestBed} from '@angular/core/testing';

describe('RefinancementPretCalcul', () => {
  it('should create an instance', () => {
    expect(new RefinancementPretCalcul(null, null, null, null, null,
      null, null, null, null, null, null, null,
      null, null, null, null, null,
      null, null, null, null, null, null)).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
