import { TestBed } from '@angular/core/testing';

import { UsufruitService } from './usufruit.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

describe('UsufruitService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
      AuthService,
      CookieService,
    ],
  }));

  it('should be created', () => {
    const service: UsufruitService = TestBed.inject(UsufruitService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
