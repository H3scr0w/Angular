import { EuroNumberPipe } from './euro-number.pipe';
import {TestBed} from '@angular/core/testing';

describe('EuroNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new EuroNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('check undefined', () => {
    const pipe = new EuroNumberPipe();
    const result = pipe.transform(undefined);

    expect(result).toBe('');
  });

  it('check null', () => {
    const pipe = new EuroNumberPipe();
    const result = pipe.transform(null);

    expect(result).toBe('');
  });

  it('check zero value', () => {
    const pipe = new EuroNumberPipe();
    const result = pipe.transform(0);
    expect(result).toBe('0 €');
  });

  it('check number value', () => {
    const pipe = new EuroNumberPipe();
    const result = pipe.transform(1234.56);
    expect(result).toBe('1 234,56 €');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
