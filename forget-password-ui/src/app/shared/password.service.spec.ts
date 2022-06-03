import { async, inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PasswordModel } from '@app/new-password/shared/password.model';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let passwordService: PasswordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PasswordService]
    });
  });

  beforeEach(() => {
    passwordService = TestBed.get(PasswordService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([PasswordService], (service: PasswordService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable on new password', async(() => {
    const responseMock = {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    };

    // call the service
    let result;
    const passwordReset = new PasswordModel('f70ebac5e11f40dda73009072d4bdc', 'P@ssw0rd', 'P@ssw0rd');
    passwordService.updatePassword(passwordReset).subscribe(response => (result = response));

    // check that the underlying HTTP request was correct
    httpMock.expectOne('/persons').flush(responseMock);

    // check that the returned array is deserialized as expected
    expect(responseMock).toBe(result);
  }));
});
