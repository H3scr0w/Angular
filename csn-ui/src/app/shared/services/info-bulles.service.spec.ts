import {TestBed} from '@angular/core/testing';

import {InfoBullesService} from './info-bulles.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('InfoBullesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: InfoBullesService = TestBed.inject(InfoBullesService);
    expect(service).toBeTruthy();
  });
});
