import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsufruitCalculComponent} from './usufruit-calcul/usufruit-calcul.component';
import {UsufruitRestitComponent} from './usufruit-restit/usufruit-restit.component';
import {UsufruitRoutingModule} from './usufruit-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {NgxMaskModule} from 'ngx-mask';
import {ChartsModule} from 'ng2-charts';
import {EuroNumberModule} from '../../shared/euro-number/euro-number.module';
import {FormErrorDisplayModule} from '../../shared/form-error-display/form-error-display.module';
import {UsufruitInfobullesResolve} from './usufruit-infobulles-resolve';
import {InfobulleModule} from '../infobulle.module';
import {RadiobuttoninfoModule} from '../radiobuttoninfo.module';
import {StepperModule} from '../../shared/components/stepper/stepper.module';
import {BsModalRef} from 'ngx-bootstrap';
import {ModalInfoBulleModule} from '../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {CalculatedWithModule} from '../../shared/components/calculated-with/calculated-with.module';
import { UsufruitExportComponent } from './usufruit-export/usufruit-export.component';
import {ExportModule} from '../../shared/export/export.module';

@NgModule({
  declarations: [UsufruitCalculComponent, UsufruitRestitComponent, UsufruitExportComponent],
  imports: [
    CommonModule,
    UsufruitRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    ChartsModule,
    NgxMaskModule.forRoot(),
    EuroNumberModule,
    FormErrorDisplayModule,
    InfobulleModule,
    RadiobuttoninfoModule,
    StepperModule,
    ModalInfoBulleModule,
    CalculatedWithModule,
    ExportModule,
  ],
  providers: [UsufruitInfobullesResolve, BsModalRef],
})
export class UsufruitModule { }
