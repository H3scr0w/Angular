import { Credirentier } from './credirentier.model';
import {TestBed} from '@angular/core/testing';

describe('Credirentier', () => {
  it('should create an instance', () => {
    expect(new Credirentier()).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
