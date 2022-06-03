import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NumberOnlyDirective } from './number-only.directive';

@Component({
  template: `
    <form [formGroup]="testForm">
      <input
        type="text"
        class="form-control numberOnlyInput"
        id="testedInput"
        formControlName="testInput"
        stgoNumberOnly
      />
    </form>
  `
})
class FormTestComponent {
  testForm: FormGroup;
}

describe('NumberOnlyDirective', () => {
  let fixture: ComponentFixture<FormTestComponent>;
  let component: FormTestComponent;
  let numberOnlyInput: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [FormTestComponent, NumberOnlyDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTestComponent);
    component = fixture.componentInstance;
    const formBuilder = new FormBuilder();

    component.testForm = formBuilder.group({
      testInput: ''
    });

    fixture.detectChanges();

    numberOnlyInput = fixture.debugElement.query(By.css('.numberOnlyInput'));
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should set value with letter', () => {
    component.testForm.get('testInput')!.setValue('123ABGDF456');
    expect(numberOnlyInput.nativeElement.value).toEqual('123456');

    component.testForm.get('testInput')!.setValue('ABGDF456');
    expect(numberOnlyInput.nativeElement.value).toEqual('456');

    component.testForm.get('testInput')!.setValue('123ABGDF');
    expect(numberOnlyInput.nativeElement.value).toEqual('123');

    component.testForm.get('testInput')!.setValue('1A2B3G4D5F6');
    expect(numberOnlyInput.nativeElement.value).toEqual('123456');
  });
});
