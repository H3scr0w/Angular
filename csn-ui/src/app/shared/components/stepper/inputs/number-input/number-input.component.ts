import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';
import {NumberFieldType} from '../../../../enums';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';
import {MonoControlStepComponent} from '../mono-control-step.component';

@Component({
  selector: 'ngx-app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: NumberInputComponent}],
})
export class NumberInputComponent extends MonoControlStepComponent implements OnInit {
  @Input() labelId: string;
  @Input() label: string;
  @Input() maxDate: string;
  @Input() numberType: NumberFieldType;
  numberFieldTypes = NumberFieldType;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
