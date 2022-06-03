import { Directive, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive for input to only accept number character
 */
@Directive({
  selector: 'input[stgoNumberOnly]'
})
export class NumberOnlyDirective implements OnInit {
  /**
   * Instantiate the directive
   */
  constructor(private control: NgControl) {}

  /**
   * Initialize the directive
   */
  ngOnInit() {
    const currentControl = this.control.control;
    currentControl.valueChanges.subscribe(newValue => {
      if (currentControl.value) {
        const onlyNumberValue = currentControl.value.toString().replace(/[^\d]/g, '');
        currentControl.setValue(onlyNumberValue, { emitEvent: currentControl.value !== newValue });
      }
    });
  }
}
