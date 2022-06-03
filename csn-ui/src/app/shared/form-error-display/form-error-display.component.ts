import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-form-error-display',
  templateUrl: './form-error-display.component.html',
  styleUrls: ['./form-error-display.component.scss'],
})
export class FormErrorDisplayComponent implements OnInit {

  @Input() controls: FormControl[] | FormControl;
  @Input() intlPath: string;
  errors: string[] = [];

  constructor() {
  }

  ngOnInit() {

    if (!this.controls) {
      return;
    }

    if (this.controls instanceof Array) {
      this.controls.forEach(control => {
        this.subscribeOnChange(control);
      });
    } else {
      this.subscribeOnChange(this.controls);
    }
  }

  subscribeOnChange(formControl: FormControl) {
    formControl.valueChanges.subscribe(() => {
      this.setFormValidationErrors();
    });
  }

  setFormValidationErrors() {
    this.errors = [];
    if (this.controls instanceof Array) {
      this.controls.forEach(control => {
        if (control.errors) {
          this.errors = this.errors.concat(Object.keys(control.errors));
        }
      });
    } else {
      if (this.controls.errors) {
        this.errors = Object.keys(this.controls.errors);
      }
    }
  }

  isTouched() {
    if (this.controls instanceof Array) {
      return this.controls.some(control => control.touched);
    } else {
      return this.controls.touched;
    }
  }
}
