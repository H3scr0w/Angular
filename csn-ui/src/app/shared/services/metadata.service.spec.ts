import {TestBed} from '@angular/core/testing';

import {MetadataService} from './metadata.service';
import {HttpClient, HttpHandler} from '@angular/common/http';

describe('MetadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpClient,
      HttpHandler,
    ],
  }));

  it('should be created', () => {
    const service: MetadataService = TestBed.inject(MetadataService);
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});
