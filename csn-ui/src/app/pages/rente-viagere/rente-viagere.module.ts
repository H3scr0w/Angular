import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RenteViagereCalculComponent} from './rente-viagere-calcul/rente-viagere-calcul.component';
import {RenteViagereRestitComponent} from './rente-viagere-restit/rente-viagere-restit.component';
import {RenteViagereRoutingModule} from './rente-viagere-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../shared/percent-without-sign/percent-without-sign.module';
import {EuroNumberModule} from '../../shared/euro-number/euro-number.module';
import {ChartsModule} from 'ng2-charts';
import {FormErrorDisplayModule} from '../../shared/form-error-display/form-error-display.module';
import {BsModalRef, PopoverModule} from 'ngx-bootstrap';
import {RenteviagereInfobullesResolve} from './renteviagere-infobulles-resolve';
import {RadiobuttoninfoModule} from '../radiobuttoninfo.module';
import {InfobulleModule} from '../infobulle.module';
import {StepperModule} from '../../shared/components/stepper/stepper.module';
import {ModalInfoBulleModule} from '../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {PretModule} from '../pret/pret.module';
import {CalculatedWithModule} from '../../shared/components/calculated-with/calculated-with.module';
import {RenteViagereExportComponent} from './rente-viagere-export/rente-viagere-export.component';
import {ExportModule} from '../../shared/export/export.module';

@NgModule({
  declarations: [RenteViagereCalculComponent, RenteViagereRestitComponent, RenteViagereExportComponent],
  imports: [
    CommonModule,
    RenteViagereRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxChartsModule,
    TabsModule,
    NgxMaskModule.forRoot(),
    PercentWithoutSignModule,
    EuroNumberModule,
    ChartsModule,
    FormErrorDisplayModule,
    PopoverModule.forRoot(),
    InfobulleModule,
    RadiobuttoninfoModule,
    StepperModule,
    ModalInfoBulleModule,
    PretModule,
    CalculatedWithModule,
    ExportModule,
  ],
  providers: [RenteviagereInfobullesResolve, BsModalRef],
})
export class RenteViagereModule {
}
