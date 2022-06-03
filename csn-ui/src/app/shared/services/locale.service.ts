import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {

  constructor() { }

  get language() {
    return navigator.language;
  }
}
