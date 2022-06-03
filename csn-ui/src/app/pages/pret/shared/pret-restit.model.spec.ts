import { PretRestit } from './pret-restit.model';
import {TestBed} from '@angular/core/testing';

describe('PretRestit', () => {
  it('should create an instance', () => {
    expect(new PretRestit()).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
