import { Usufruitier } from './usufruitier.model';
import {TestBed} from '@angular/core/testing';

describe('Usufruitier', () => {
  it('should create an instance', () => {
    expect(new Usufruitier()).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
