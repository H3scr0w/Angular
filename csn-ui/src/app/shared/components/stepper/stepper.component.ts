import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {StepComponent} from './step.component';
import {Subscription} from 'rxjs';
import {AbstractStepInputComponent} from './abstract-step-input.component';

@Component({
  selector: 'ngx-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
/**
 * The stepper component handle the activation logic of its content.
 * A stepper can have multiple step, and every step can have multiple inputs like this :
 *        Stepper
 *          Step
 *            Step-input
 *            Step-input
 *          Step
 *            Step-input
 *
 * Where :
 *    - every Step is aware of its inputs. It knows what is the next input.
 *    - every Input : is self aware of its own deactivation/activation/controls...
 *                    sends an event when it becomes valid or invalid.
 *    - The stepper observes any input event so it can enable/disable the next input.
 */
export class StepperComponent implements AfterContentInit {


  @ContentChildren(StepComponent, {descendants: true}) public steps: QueryList<StepComponent>;

  private nextStepHandlerSubscription: Subscription[] = [];

  // The module name, used to display title
  @Input() moduleName: string;

  private _isFirstActive: boolean = true;
  @Input()
  /**
   * Triggers enabling the first step's first input
   */
  set isFirstActive(val: boolean) {
    this._isFirstActive = val;
    if (val && this.steps) {
      this.setInputStatus(this.steps.first.stepInputs.first, val);
    }
  }

  get isFirstActive(): boolean {
    return this._isFirstActive;
  }

  ngAfterContentInit() {
    this.setupNextStepHandlerSubscriptions();

    // If any step is added/removed, rebind next step handling
    this.steps.changes.subscribe(() => {
      this.resetNextBindings();
    });
    // If any input is added/removed, rebind next step handling
    this.steps.forEach(step =>
      step.stepInputs.changes.subscribe(() => {
        this.resetNextBindings();
      }));

    if (this.steps.length > 0 && this.steps.first.stepInputs.first) {
      this.setInputStatus(this.steps.first.stepInputs.first, this.isFirstActive);
    }
  }

  /**
   * Reset every binding of which input is next
   */
  resetNextBindings(): void {
    this.destroyNextStepHandlerSubscriptions();
    this.setupNextStepHandlerSubscriptions();

    // Binding are sets but statuses are not. Update Every statuses.
    // Timeout tricks the ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.steps.forEach(formStep =>
        formStep.stepInputs.forEach(input => {
          this.setInputStatus(this.getNextInput(formStep, input), input.isValid());
        }));
    });
  }

  /**
   * Setup every binding of which input is next
   */
  setupNextStepHandlerSubscriptions(): void {
    this.steps.forEach(step =>
      step.stepInputs.forEach(input => {
        this.nextStepHandlerSubscription.push(input.valueChanged.subscribe(value => {
          this.setInputStatus(this.getNextInput(step, input), value);
        }));
      }));
  }

  destroyNextStepHandlerSubscriptions(): void {
    this.nextStepHandlerSubscription.forEach(sub => sub.unsubscribe());
  }

  /**
   * Ask the given step and the given input which is the next input
   * @param step the current step
   * @param input the current input
   */
  getNextInput(step: StepComponent, input: AbstractStepInputComponent): AbstractStepInputComponent {
    const nextInput = step.getNextInput(input);
    if (nextInput == null) {
      // Ask the current step which is next input
      const currentStepIndex = this.steps.toArray().findIndex(value => value === step);
      // If it couldn't find, ask to the next step
      if (currentStepIndex + 1 >= this.steps.length) {
        return null;
      } else {
        return this.steps.toArray()[currentStepIndex + 1].stepInputs.toArray()[0];
      }
    }
    return nextInput;
  }

  /**
   * Enable or disable the given input from the given status
   * @param input
   * @param enabled
   */
  setInputStatus(input: AbstractStepInputComponent, enabled: boolean): void {
    if (input != null && enabled !== input.enabledStatus()) {
      if (enabled) {
        input.enable();
      } else {
        input.disable();
      }
    }
  }

  isStepActive(i: number): boolean {
    return (i === 0 && this.isFirstActive) ||
      (i > 0 && i < this.steps.length && this.steps.toArray()[i - 1].isComplete());
  }
}
