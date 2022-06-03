import {TestBed} from '@angular/core/testing';
import {NouveauCreditModel} from './nouveau-credit.model';

describe('NouveauCreditModel', () => {
  it('should create an instance', () => {
    expect(new NouveauCreditModel(null, null,
      null, null, null,
      null, null, null)).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
