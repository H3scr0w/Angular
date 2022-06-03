import {TestBed} from '@angular/core/testing';
import {CreditInitialModel} from './credit-initial.model';

describe('CreditInitialModel', () => {
  it('should create an instance', () => {
    expect(new CreditInitialModel(null, null, null, null,
      null, null, null, null, null,
      null, null, null)).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
