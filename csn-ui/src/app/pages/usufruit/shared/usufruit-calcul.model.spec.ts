import { UsufruitCalcul } from './usufruit-calcul.model';
import {TestBed} from '@angular/core/testing';

describe('UsufruitCalcul', () => {
  it('should create an instance', () => {
    expect(new UsufruitCalcul('2000-01-01',  'TEMPORAIRE',
      200000, 1000, 150, '', '')).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
