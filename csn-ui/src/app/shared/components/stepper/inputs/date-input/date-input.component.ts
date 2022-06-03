import {Component, Input} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';
import {MonoControlStepComponent} from '../mono-control-step.component';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';

@Component({
  selector: 'ngx-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: DateInputComponent}],

})
export class DateInputComponent extends MonoControlStepComponent {
  @Input() labelId: string;
  @Input() label: string;
  @Input() maxDate: string;
  // Used to display "Champ facultatif" as we can't get it directly from the formControl. Shame
  @Input() isRequired: boolean = true;

  constructor() {
    super();
  }
}
