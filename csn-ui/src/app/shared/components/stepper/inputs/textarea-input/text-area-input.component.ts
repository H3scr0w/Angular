import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroupDirective} from '@angular/forms';
import {AbstractStepInputComponent} from '../../abstract-step-input.component';
import {MonoControlStepComponent} from '../mono-control-step.component';

@Component({
  selector: 'ngx-textarea-input',
  templateUrl: './text-area-input.component.html',
  styleUrls: ['./text-area-input.component.scss'],
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupDirective}],
  providers: [{provide: AbstractStepInputComponent, useExisting: TextAreaInputComponent}],
})
export class TextAreaInputComponent extends MonoControlStepComponent implements OnInit {
  @Input() labelId: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() toPrint: boolean = false;
  private maxLength: number = 250;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
