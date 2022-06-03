import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

export interface IEventEmitterService {
  onFormValidate(): void;
}

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService implements IEventEmitterService {
  invokeFormValidateFunction = new EventEmitter<void>();
  subsVar: Subscription;
  validStatus: boolean[];
  constructor() {}

  onFormValidate(): void {
    this.validStatus = [];
    this.invokeFormValidateFunction.emit();
    if (this.subsVar) {
      this.subsVar.unsubscribe();
    }
  }
}
