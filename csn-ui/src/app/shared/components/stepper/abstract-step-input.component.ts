/**
 * Common modules behaviours
 */
import {Component, EventEmitter, Input, TemplateRef, ViewChild} from '@angular/core';

/**
 * Base class for every step input. Every step has its own activation logic and view.
 * Since every input must know its status, it
 */
@Component({
  template: '',
})
export abstract class AbstractStepInputComponent {

  // required to display inputs. Every input must have a template referenced #innerTemplate
  @ViewChild('innerTemplate', {static: true})
  public innerTemplate: TemplateRef<any>;

  // The content of the tooltip to display with the input
  @Input() tooltipContent = '';

  // Inputs used to apply css
  @Input() formGroupClass = '';
  @Input() hasFormGroupCssClass: boolean = true;
  @Input() isGroupInvalid: boolean = false;

  /**
   * The event the stepper is observing to enable/disable the next input.
   */
  valueChanged: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  /**
   * Weather the input is valid or not
   */
  abstract isValid(): boolean ;

  /**
   * The input current enable status
   */
  abstract enabledStatus(): boolean ;

  /**
   * How to enable the input
   */
  abstract enable(): void ;

  /**
   * How to disable the input
   */
  abstract disable(): void;

}
