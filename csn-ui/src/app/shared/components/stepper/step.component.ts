import {Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild} from '@angular/core';
import {AbstractStepInputComponent} from './abstract-step-input.component';


@Component({
  selector: 'ngx-step',
  templateUrl: './step.component.html',
})
/**
 * Every Step is aware of its inputs and handles its display and which's next.
 */
export class StepComponent {

  @Input() tooltipContent = '';

  @Input() stepCss: string = '';

  @ViewChild('stepInnerTemplate', {static: true})
  public stepInnerTemplate: TemplateRef<any>;

  @ContentChildren(AbstractStepInputComponent, {descendants: true})
  public stepInputs: QueryList<AbstractStepInputComponent>;

  /**
   * Weather the step is complete i.e every of its input is complete
   */
  isComplete(): boolean {
    return this.stepInputs && this.stepInputs.length &&
      this.stepInputs.toArray().every(input => input.isValid());
  }

  /**
   * Find the given input and returns the next one
   * @param input the input we want its next
   */
  getNextInput(input: AbstractStepInputComponent): AbstractStepInputComponent {
    const currentStepIndex = this.stepInputs.toArray().findIndex(value => value === input);
    if (currentStepIndex + 1 >= this.stepInputs.length) {
      return null;
    }
    return this.stepInputs.toArray()[currentStepIndex + 1];
  }

}
