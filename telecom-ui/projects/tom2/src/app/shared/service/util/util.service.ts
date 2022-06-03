import { Injectable } from '@angular/core';

export interface IUtilService {
  toNumber(value: any): number;
  addDaysInDate(date: Date, days: number): Date;
}

@Injectable({
  providedIn: 'root'
})
export class UtilService implements IUtilService {
  constructor() {}

  toNumber(value: any): number {
    if (!value) {
      return 0;
    }
    return Number(value);
  }

  addDaysInDate(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
