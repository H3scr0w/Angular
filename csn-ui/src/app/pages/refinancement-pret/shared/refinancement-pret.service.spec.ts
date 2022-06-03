import { TestBed } from '@angular/core/testing';

import { RefinancementPretService } from './refinancement-pret.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('RefinancementPretService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: RefinancementPretService = TestBed.inject(RefinancementPretService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
