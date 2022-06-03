import {Component, Input} from '@angular/core';
import {NumberFieldType} from '../../../../enums';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';
import {NoInputStepComponent} from '../no-input-step.component';

@Component({
  selector: 'ngx-app-value-display',
  templateUrl: './value-display.component.html',
  styleUrls: ['./value-display.component.scss'],
  providers: [{provide: AbstractStepInputComponent, useExisting: ValueDisplayComponent}],
})
/**
 * Display a simple value in the stepper
 */
export class ValueDisplayComponent extends NoInputStepComponent {

  @Input() label: string;
  @Input() value: string;
  @Input() numberType: NumberFieldType;
  numberFieldTypes = NumberFieldType;

  isANumber(): boolean {
    return !isNaN(Number(this.value));
  }

}
