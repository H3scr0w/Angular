import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StepperComponent} from './stepper.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxMaskModule} from 'ngx-mask';
import {EuroNumberModule} from '../../euro-number/euro-number.module';
import {PopoverModule} from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StepComponent} from './step.component';
import {DateInputComponent} from './inputs/date-input/date-input.component';
import {RadioInputComponent} from './inputs/radio-input/radio-input.component';
import {NumberInputComponent} from './inputs/number-input/number-input.component';
import {FormErrorDisplayModule} from '../../form-error-display/form-error-display.module';
import {ValueDisplayComponent} from './inputs/value-display/value-display.component';
import {DureeInputComponent} from './inputs/duree-input/duree-input.component';
import {InfobulleModule} from '../../../pages/infobulle.module';
import {PersonsComponent} from './inputs/persons/persons.component';
import {RadiobuttoninfoModule} from '../../../pages/radiobuttoninfo.module';
import {DureeSelectInputComponent} from './inputs/duree-select-input/duree-select-input.component';
import {TextAreaInputComponent} from './inputs/textarea-input/text-area-input.component';


@NgModule({
  declarations: [
    StepperComponent, StepComponent,
    DateInputComponent, RadioInputComponent, NumberInputComponent, ValueDisplayComponent,
    DureeInputComponent,
    PersonsComponent,
    DureeSelectInputComponent,
    TextAreaInputComponent],

  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    EuroNumberModule,
    PopoverModule.forRoot(),
    FormErrorDisplayModule,
    InfobulleModule,
    RadiobuttoninfoModule,
  ],
  exports: [
    StepperComponent,
    StepComponent,
    DateInputComponent,
    RadioInputComponent,
    NumberInputComponent,
    ValueDisplayComponent,
    DureeInputComponent,
    PersonsComponent,
    DureeSelectInputComponent,
    TextAreaInputComponent,
  ],
})
export class StepperModule {
}
