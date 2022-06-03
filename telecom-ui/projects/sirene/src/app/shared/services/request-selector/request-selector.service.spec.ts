import { TestBed } from '@angular/core/testing';
import { DropDownType } from '../../models/dropdown-type';
import { RequestSelectorService } from './request-selector.service';

describe('RequestSelectorService', () => {
  let requestSelectorService: RequestSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestSelectorService]
    });
  });

  beforeEach(() => {
    requestSelectorService = TestBed.inject(RequestSelectorService);
  });

  it('should be created', () => {
    const service: RequestSelectorService = TestBed.inject(RequestSelectorService);
    expect(service).toBeTruthy();
  });

  it('should return actions', () => {
    const expectedActions: DropDownType[] = [
      {
        id: 'C',
        value: 'Creation'
      },
      {
        id: 'M',
        value: 'Modification'
      },
      {
        id: 'A',
        value: 'Deletion'
      }
    ];

    const actulAction = requestSelectorService.getRequestActions();
    expect(actulAction).toEqual(expectedActions);
  });
});
