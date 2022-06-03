import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Action } from '../../models/action';
import { Page } from '../../models/page.model';
import { ActionService } from './action.service';
describe('ActionService', () => {
  let actionService: ActionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ActionService]
    });
  });

  beforeEach(() => {
    actionService = TestBed.inject(ActionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ActionService = TestBed.inject(ActionService);
    expect(service).toBeTruthy();
  });

  it('should return an Observable of a OperatorParameters paginated', async(() => {
    // fake response
    const expectedResponse: Page<Action> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<Action>;
    actionService.getAllActions(0, 10, null, '').subscribe((result: Page<Action>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/actions?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
