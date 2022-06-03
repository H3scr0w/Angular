import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Page } from '@shared';
import { Contact } from '../../models/contact';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let contactService: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });
  });

  beforeEach(() => {
    contactService = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ContactService = TestBed.inject(ContactService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a Contact paginated', async(() => {
    // fake response
    const expectedResponse: Page<Contact> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Contact>;
    contactService.getAllContacts(0, 10, null, '').subscribe((result: Page<Contact>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/common/users?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
