import { Directive, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Directive for input to only accept number character
 */
@Directive({
  selector: 'input[stgoNumberOnly]'
})
export class NumberOnlyDirective implements OnInit, OnDestroy {
  @Input()
  scale = '0';

  @Input()
  precision = '18';

  @Input()
  defaultValue = '0';

  private sub$: Subscription;

  constructor(private control: NgControl) {}

  ngOnInit() {
    const currentControl = this.control.control;
    this.sub$ = currentControl.valueChanges.subscribe(newValue => {
      if (currentControl.value) {
        let onlyNumberValue: string;
        let finalValue = '';
        if (Number(this.scale) > 0) {
          onlyNumberValue = currentControl.value.toString().replace(/[^0-9.]/g, '');
          const splitValue: string[] = onlyNumberValue.split('.');
          if (splitValue.length > 1) {
            if (splitValue[0]) {
              finalValue = splitValue[0] + '.' + splitValue[1].slice(0, Number(this.scale));
            } else {
              finalValue = '0' + '.' + splitValue[1].slice(0, Number(this.scale));
            }
          } else {
            finalValue = onlyNumberValue;
          }
        } else {
          finalValue = currentControl.value.toString().replace(/[^0-9]/g, '');
        }
        if (finalValue.length > Number(this.precision)) {
          finalValue = finalValue.slice(0, Number(this.precision));
        }
        currentControl.setValue(finalValue, { emitEvent: currentControl.value !== newValue });
      } else {
        currentControl.setValue(this.defaultValue, { emitEvent: currentControl.value !== newValue });
      }
    });
  }

  // remove last dot if user does not type any digit after dot
  @HostListener('blur') onBlur() {
    const currentControl = this.control.control;
    if (currentControl && currentControl.value) {
      let finalValue: string = currentControl.value;
      if (!finalValue.match(/^-?[0-9,\.]+$/)) {
        finalValue = '0';
        currentControl.setValue(finalValue, { emitEvent: currentControl.value !== finalValue });
      } else {
        const lastChar = finalValue.charAt(finalValue.length - 1);
        if (lastChar === '.') {
          finalValue = finalValue.replace('.', '');
          currentControl.setValue(finalValue, { emitEvent: currentControl.value !== finalValue });
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
