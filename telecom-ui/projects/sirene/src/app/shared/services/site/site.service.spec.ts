import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Page, Site } from '@shared';
import { SiteService } from './site.service';

describe('SiteService', () => {
  let siteService: SiteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SiteService]
    });
  });

  beforeEach(() => {
    siteService = TestBed.inject(SiteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', inject([SiteService], (service: SiteService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an Observable of a sites paginated', async(() => {
    // fake response
    const expectedResponse: Page<Site> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Site>;
    siteService.getAllSites(0, 10).subscribe((result: Page<Site>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/sites?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));

  it('should return an Observable of deleted site', async(() => {
    // fake response
    const expectedResponse: Site = {
      siteCode: '1',
      city: null,
      siteType: null,
      oldSite: '',
      statusSite: '',
      statusDate: null,
      siteOperatorOnSite: '',
      siteFixePhone: '',
      rsm: null,
      usualName: '',
      address1: '',
      address2: '',
      address3: '',
      postCode: '',
      numberUsers: 0,
      itManager: null,
      comments: '',
      company: null,
      creationDate: null,
      lastUpdate: null,
      archiveDate: null,
      lastUser: '',
      securityContact: null,
      telephonyContact: null,
      pstnNumber: '',
      notAutomaticArchived: null,
      longitude: null,
      latitude: null,
      backbone: 0,
      isVideo: null,
      siteName: '',
      segmentations: null,
      tempUnknownAddress: '',
      timeZoneId: 0,
      iptServiceManager: null,
      secondPhoneNo: '',
      attachedFiles: null,
      application: null,
      withoutDevices: false,
      rsmId: 0
    };

    // call the service
    let actualResponse: Site;
    siteService.deleteSite('1').subscribe((result: Site) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/sites/1')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
