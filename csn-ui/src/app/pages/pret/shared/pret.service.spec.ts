import { TestBed } from '@angular/core/testing';

import { PretService } from './pret.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('PretService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: PretService = TestBed.inject(PretService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
