import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Contact } from '../../../../../sirene/src/app/shared/models/contact';
import { Page } from '../models/page.model';
import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let deviceService: DeviceService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeviceService]
    })
  );

  beforeEach(() => {
    deviceService = TestBed.inject(DeviceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: DeviceService = TestBed.inject(DeviceService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Contacts paginated', async(() => {
    // fake response
    const expectedResponse: Page<Contact> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Contact>;
    deviceService
      .getContactBySGTConnectionCode('', 0, 10)
      .subscribe((result: Page<Contact>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/devices/contacts?page=0&size=10&statuses=ACTIVE,PROACTIVE')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
