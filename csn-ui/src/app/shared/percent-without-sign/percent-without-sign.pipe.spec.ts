import { PercentWithoutSignPipe } from './percent-without-sign.pipe';
import {TestBed} from '@angular/core/testing';

describe('PercentWithoutSignPipe', () => {
  it('create an instance', () => {
    const pipe = new PercentWithoutSignPipe();
    expect(pipe).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
