import { Injectable } from '@angular/core';
import { DropDownType } from '../../models/dropdown-type';

export interface IRequestSelectorService {
  getRequestActions(): DropDownType[];
  getRequestType(): DropDownType[];
  getRequeststatus(): DropDownType[];
}

@Injectable({
  providedIn: 'root'
})
export class RequestSelectorService implements IRequestSelectorService {
  private actions: DropDownType[] = [
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

  private types: DropDownType[] = [
    {
      id: 'site',
      value: 'Site'
    },
    {
      id: 'company',
      value: 'Company'
    }
  ];

  private status: DropDownType[] = [
    {
      id: 'I',
      value: 'Incoming'
    },
    {
      id: 'M',
      value: 'Mail notified'
    },
    {
      id: 'C',
      value: 'Cancelled'
    }
  ];

  constructor() {}

  getRequestActions(): DropDownType[] {
    return this.actions;
  }

  getRequestType(): DropDownType[] {
    return this.types;
  }

  getRequeststatus(): DropDownType[] {
    return this.status;
  }
}
