import { DropDownType } from '../../models/dropdown-type';
import { IRequestSelectorService } from './request-selector.service';

export class MockRequestSelectorService implements IRequestSelectorService {
  getRequestActions(): DropDownType[] {
    return null;
  }
  getRequestType(): DropDownType[] {
    return null;
  }
  getRequeststatus(): DropDownType[] {
    return null;
  }
}
