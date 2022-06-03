import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';
import {ControlContainer, FormControl, FormGroupDirective} from '@angular/forms';
import {DureeType} from '../../../../enums';
import {Subscription} from 'rxjs';

@Component({
  selector: 'ngx-app-duree-select-input',
  templateUrl: './duree-select-input.component.html',
  styleUrls: ['./duree-select-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: DureeSelectInputComponent}],
})
export class DureeSelectInputComponent extends AbstractStepInputComponent implements OnInit, OnDestroy {
  formGroupClass = 'form-group-input-dual';
  @Input() label: string;
  dureeType = DureeType;

  // inputs to fill
  @Input() inputCtrlDuree: FormControl;
  @Input() inputCtrlDureeType: FormControl;

  // names of the input in the FormGroup
  @Input() formNameDuree: string;
  @Input() formNameDureeType: string;

  private changeSubscriptionDuree: Subscription;
  private changeSubscriptionDureeType: Subscription;
  constructor() {
    super();
  }

  ngOnInit() {
    if (this.inputCtrlDuree) {
      this.changeSubscriptionDuree = this.inputCtrlDuree.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });
    }
    if (this.inputCtrlDureeType) {
      this.changeSubscriptionDureeType = this.inputCtrlDureeType.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });
    }
  }

  ngOnDestroy() {
    if (this.changeSubscriptionDuree) {
      this.changeSubscriptionDuree.unsubscribe();
    }
    if (this.changeSubscriptionDureeType) {
      this.changeSubscriptionDureeType.unsubscribe();
    }
    this.disable();
  }

  isValid(): boolean {
    return this.inputCtrlDuree.valid && this.inputCtrlDureeType.valid;
  }

  enabledStatus(): boolean {
    return this.inputCtrlDuree.enabled && this.inputCtrlDureeType.enabled;
  }
  enable(): void {
    this.inputCtrlDuree.enable();
    this.inputCtrlDureeType.enable();
  }
  disable(): void {
    if (this.inputCtrlDuree) {
      this.inputCtrlDuree.disable();
    }
    if (this.inputCtrlDureeType) {
      this.inputCtrlDureeType.disable();
    }
  }

}
