import {MentionsLegalesService} from './mentions-legales.service';
import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('MentionsLegalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: MentionsLegalesService = TestBed.inject(MentionsLegalesService);
    expect(service).toBeTruthy();
  });
});
