/**
 * Common modules behaviours
 */
import {AbstractStepInputComponent} from '../abstract-step-input.component';
import {Component} from '@angular/core';

/**
 * Handles the logic of something used as readonly in the stepper.
 * As soon as it's enabled, It sends to the stepper the enable the next input.
 */
@Component({
  template: '',
})
export abstract class NoInputStepComponent extends AbstractStepInputComponent {

  isActive = true;

  constructor() {
    super();
  }

  isValid() {
    return this.isActive;
  }

  enabledStatus() {
    return this.isActive;
  }

  enable() {
    this.isActive = true;
    this.valueChanged.emit(this.isActive);
  }

  disable() {
    this.isActive = false;
    this.valueChanged.emit(this.isActive);
  }
}
