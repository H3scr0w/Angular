import { TestBed } from '@angular/core/testing';

import { RachatRenteViagereService } from './rachat-rente-viagere.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RachatRenteViagereService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: RachatRenteViagereService = TestBed.inject(RachatRenteViagereService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
