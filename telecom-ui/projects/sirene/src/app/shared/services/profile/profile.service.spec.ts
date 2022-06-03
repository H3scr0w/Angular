import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { Profile } from '../../models/profile';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let profileService: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService]
    })
  );

  beforeEach(() => {
    profileService = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ProfileService = TestBed.inject(ProfileService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Profile paginated', async(() => {
    // fake response
    const expectedResponse: Page<Profile> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Profile>;
    profileService.getAllProfiles(0, 10).subscribe((result: Page<Profile>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/common/profiles?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
