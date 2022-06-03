import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicControlBase } from '../../classes/dynamic-control-base';

export interface IDynamicControlService {
  toFormGroup(controls: DynamicControlBase<any>[]): FormGroup;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicControlService implements IDynamicControlService {
  constructor() {}

  toFormGroup(controls: DynamicControlBase<any>[]): FormGroup {
    const group: any = {};

    controls.forEach(control => {
      group[control.key] = control.required
        ? new FormControl(control.value || '', Validators.required)
        : new FormControl(control.value || '');
    });
    return new FormGroup(group);
  }
}
