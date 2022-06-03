import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlContainer, FormControl, FormGroupDirective} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';

@Component({
  selector: 'ngx-app-duree-input',
  templateUrl: './duree-input.component.html',
  styleUrls: ['./duree-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: DureeInputComponent}],
})
/**
 * Handles the logic and display of a 2 FormControl to fill a year / month.
 */
export class DureeInputComponent extends AbstractStepInputComponent implements OnInit, OnDestroy {
  formGroupClass = 'form-group-input-dual';
  @Input() label: string;

  // inputs to fill
  @Input() inputCtrlMois: FormControl;
  @Input() inputCtrlAnnee: FormControl;

  // names of the input in the FormGroup
  @Input() formNameMois: string;
  @Input() formNameAnnee: string;

  private changeSubscriptionAnnee: Subscription;
  private changeSubscriptionMois: Subscription;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.inputCtrlMois) {
      this.changeSubscriptionMois = this.inputCtrlMois.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });
    }
    if (this.inputCtrlAnnee) {
      this.changeSubscriptionAnnee = this.inputCtrlAnnee.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });
    }
  }

  ngOnDestroy() {
    if (this.changeSubscriptionMois) {
      this.changeSubscriptionMois.unsubscribe();
    }
    if (this.changeSubscriptionAnnee) {
      this.changeSubscriptionAnnee.unsubscribe();
    }
    this.disable();
  }

  isValid(): boolean {
    return this.inputCtrlMois.valid && this.inputCtrlAnnee.valid;
  }

  enabledStatus(): boolean {
    return this.inputCtrlMois.enabled && this.inputCtrlAnnee.enabled;
  }

  enable(): void {
    this.inputCtrlMois.enable();
    this.inputCtrlAnnee.enable();
  }

  disable(): void {
    if (this.inputCtrlMois) {
      this.inputCtrlMois.disable();
    }
    if (this.inputCtrlAnnee) {
      this.inputCtrlAnnee.disable();
    }
  }
}
