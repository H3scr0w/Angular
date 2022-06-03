import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';
import {RadioInputModel} from './radio-input-model';
import {MonoControlStepComponent} from '../mono-control-step.component';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';

@Component({
  selector: 'ngx-radio-input',
  templateUrl: './radio-input.component.html',
  styleUrls: ['./radio-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: RadioInputComponent}],
})
export class RadioInputComponent extends MonoControlStepComponent implements OnInit {

  formGroupClass = 'form-group-btn';
  @Input() label: string;
  // Params for custom display of radio buttons
  @Input() isNumbers: boolean = false;
  @Input() model: RadioInputModel[];

  chunkedModel: Array<RadioInputModel>[];

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    // split in sub arrays as we only display 2 radio-button per line
    if (this.model) {
      this.chunkedModel = this.splitArrayInChunks(this.model, 2);
    }
  }

  /**
   * Split the given array in sub array with given size
   * @param arr
   * @param size
   */
  splitArrayInChunks(arr: RadioInputModel[], size: number): Array<RadioInputModel>[] {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  }

  hasValue(value): boolean {
    return this.inputCtrl && this.inputCtrl.value === value;
  }
  isValue(value): boolean {
    return this.inputCtrl ? this.inputCtrl.value === value : false;
  }
}
