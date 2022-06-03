import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { TokenService } from '@app/shared';
import { TokenModel } from '@app/shared';

describe('TokenService', () => {
  let tokenService: TokenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TokenService]
    });
  });

  beforeEach(() => {
    tokenService = TestBed.get(TokenService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([TokenService], (service: TokenService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a temporary link', async(() => {
    // fake response
    const temporaryLink = new TokenModel(
      1,
      'c9d7cb657f87455ea922e4c71e1863ee1527234865519dfaf1022e1314e7195cb7aa504b64d15',
      'T1234567',
      'test@test.com',
      new Date(),
      false
    );

    // call the service
    let actualLink: TokenModel;
    tokenService
      .getLink('c9d7cb657f87455ea922e4c71e1863ee1527234865519dfaf1022e1314e7195cb7aa504b64d15')
      .subscribe(link => (actualLink = link));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/token/c9d7cb657f87455ea922e4c71e1863ee1527234865519dfaf1022e1314e7195cb7aa504b64d15')
      // return the fake response when we receive a request
      .flush(temporaryLink);

    // check that the returned object is deserialized as expected
    expect(actualLink).toBe(temporaryLink);
  }));
});
