/**
 * Common modules behaviours
 */
import {Input, OnDestroy, OnInit, Component} from '@angular/core';
import {AbstractStepInputComponent} from '../abstract-step-input.component';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';

/**
 * Handles the logic of an input with an uniq FormControl.
 */
@Component({
  template: '',
})
export abstract class MonoControlStepComponent extends AbstractStepInputComponent implements OnInit, OnDestroy {

  // The FormControl to manage
  @Input() inputCtrl: FormControl;

  private changeSubscription: Subscription;

  constructor() {
    super();
  }

  ngOnInit() {
    /**
     * If its value change, send a message to the stepper and the value to apply to the next input
     */
    if (this.inputCtrl) {
      this.changeSubscription = this.inputCtrl.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });
    }
  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    if (this.inputCtrl) {
      this.inputCtrl.setValue('');

    }
    this.disable();
  }

  isValid(): boolean {
    return this.inputCtrl && this.inputCtrl.valid;
  }

  enabledStatus(): boolean {
    return this.inputCtrl && this.inputCtrl.enabled;
  }

  enable(): void {
    if (this.inputCtrl) {
      this.inputCtrl.enable();
    }
  }

  disable(): void {
    if (this.inputCtrl) {
      this.inputCtrl.disable();
    }
  }
}
