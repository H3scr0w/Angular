import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../../../constants';
import { Sexe } from '../../../../enums';
import { AbstractStepInputComponent } from '../../abstract-step-input.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngx-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
  providers: [{ provide: AbstractStepInputComponent, useExisting: PersonsComponent }],
})
/**
 * Nested Input for stepper. Used to fill a person gender/birthdate
 */
export class PersonsComponent extends AbstractStepInputComponent implements OnInit, OnDestroy, OnChanges  {

  formGroupClass = 'form-group-person';
  @Input() formGroup: FormGroup;
  @Input() personFormArray: FormArray;
  @Input() formArrayName: string;
  @Input() label: string;
  @Input() btnAddText: string;
  @Input() btnRemoveText: string;
  @Input() dataToRestore = [];
  @Input() maxPersons: number = 2;
  @Input() toPrint: boolean = false;

  sexe = Sexe;
  private changeSubscription: Subscription;

  constructor(private _formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {
    if (this.personFormArray) {
      this.changeSubscription = this.personFormArray.valueChanges.subscribe(() => {
        this.valueChanged.emit(this.isValid());
      });

      if (this.personFormArray.length === 0) {
        this.addPerson({});
      }
      this.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updatePersonData(changes.dataToRestore.currentValue);

  }

  ngOnDestroy() {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
    if (this.personFormArray) {
      this.personFormArray.clear();
    }
    this.disable();
  }

  maxSizeReached(): boolean {
    return this.personFormArray.length >= this.maxPersons;
  }

  /**
   * Add a new person to the form
   * @param p fills the person fields with its content if it exists
   */
  addPerson(p: any): void {
    if (!this.maxSizeReached()) {
      this.personFormArray.push(this._formBuilder.group({
        sexe: [p ? p.sexe : '', Validators.required],
        date_naissance: [p ? p.date_naissance : '', [Validators.required, Constants.maxBirthDateValidator(),
        Validators.pattern(Constants.patternDate)]],
      }));
    }
  }

  /**
   * Remove a person from a given index
   * @param index
   */
  removePerson(index: any): void {
    this.personFormArray.removeAt(index);
  }

  isIntermediate(i: number): boolean {
    const length = this.personFormArray.controls.length;
    return i > 0 && i < length - 1;
  }

  isLast(i: number): boolean {
    const length = this.personFormArray.controls.length;
    return i === length - 1 && length > 1;
  }

  isValid(): boolean {
    return this.toPrint || (this.personFormArray && this.personFormArray.valid);
  }

  enabledStatus(): boolean {
    return this.toPrint || (this.personFormArray && this.personFormArray.enabled);
  }

  enable(): void {
    if (this.personFormArray) {
      this.personFormArray.enable();
    }
  }

  disable(): void {
    if (this.personFormArray) {
      this.personFormArray.disable();
    }
  }

  private updatePersonData(currentData: any) {
    if (currentData && currentData.length > 0) {
      this.personFormArray.clear();
      currentData.forEach(value => this.addPerson(value));
    }
  }
}
