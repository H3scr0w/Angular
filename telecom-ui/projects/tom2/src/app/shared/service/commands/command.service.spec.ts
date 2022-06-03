import { async, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommandsDTO } from '../../models/commands';
import { Page } from '../../models/page.model';
import { CommandService } from './command.service';

describe('CommandService', () => {
  let commandService: CommandService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommandService]
    });
  });

  beforeEach(() => {
    commandService = TestBed.inject(CommandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: CommandService = TestBed.inject(CommandService);
    expect(service).toBeTruthy();
  });
  it('should return an Observable of a Commands paginated', async(() => {
    // fake response
    const expectedResponse: Page<CommandsDTO> = {
      totalElements: 0,
      content: []
    };

    // call the service
    let actualResponse: Page<CommandsDTO>;
    commandService
      .getAllCommands('', 0, 10, null, '', null)
      .subscribe((result: Page<CommandsDTO>) => (actualResponse = result));

    // check that the underlying HTTP request was correct
    httpMock
      .expectOne('/commands?page=0&size=10')
      // return the fake response when we receive a request
      .flush(expectedResponse);

    // check that the returned object is deserialized as expected
    expect(actualResponse).toBe(expectedResponse);
  }));
});
