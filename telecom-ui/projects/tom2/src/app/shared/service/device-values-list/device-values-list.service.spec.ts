import { async, inject, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeviceValuesListService } from './device-values-list.service';

import { DeviceValuesList } from '../../models/device-values-list';
import { Page } from '../../models/page.model';

describe('DeviceValuesListService', () => {
  let deviceValuesListService: DeviceValuesListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeviceValuesListService]
    });
  });

  beforeEach(() => {
    deviceValuesListService = TestBed.inject(DeviceValuesListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([DeviceValuesListService], (service: DeviceValuesListService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a DeviceValuesList paginated', async(() => {
    // fake response
    const expectedResponse: Page<DeviceValuesList> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<DeviceValuesList>;
    deviceValuesListService
      .getAllDeviceValuesList(0, 10, '', '', '')
      .subscribe((result: Page<DeviceValuesList>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/spo/device-values-list?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
