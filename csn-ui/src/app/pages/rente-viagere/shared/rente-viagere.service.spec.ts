import { TestBed } from '@angular/core/testing';

import { RenteViagereService } from './rente-viagere.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

describe('RenteViagereService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      AuthService,
      CookieService,
    ],
  }));

  it('should be created', () => {
    const service: RenteViagereService = TestBed.inject(RenteViagereService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
