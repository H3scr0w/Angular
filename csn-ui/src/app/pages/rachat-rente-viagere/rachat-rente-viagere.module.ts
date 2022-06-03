import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RachatRenteViagereCalculComponent} from './rachat-rente-viagere-calcul/rachat-rente-viagere-calcul.component';
import {RachatRenteViagereRestitComponent} from './rachat-rente-viagere-restit/rachat-rente-viagere-restit.component';
import {RachatRenteViagereRoutingModule} from './rachat-rente-viagere-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../shared/percent-without-sign/percent-without-sign.module';
import {EuroNumberModule} from '../../shared/euro-number/euro-number.module';
import {FormErrorDisplayModule} from '../../shared/form-error-display/form-error-display.module';
import {BsModalRef, PopoverModule} from 'ngx-bootstrap';
import {InfobulleModule} from '../infobulle.module';
import {RadiobuttoninfoModule} from '../radiobuttoninfo.module';
import {RachatRenteviagereInfobullesResolve} from './rachat-rente-viagere-infobulles-resolve';
import {StepperModule} from '../../shared/components/stepper/stepper.module';
import {ModalInfoBulleModule} from '../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {CalculatedWithModule} from '../../shared/components/calculated-with/calculated-with.module';


@NgModule({
  declarations: [RachatRenteViagereCalculComponent, RachatRenteViagereRestitComponent],
  imports: [
    CommonModule,
    RachatRenteViagereRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    PercentWithoutSignModule,
    EuroNumberModule,
    FormErrorDisplayModule,
    PopoverModule.forRoot(),
    InfobulleModule,
    RadiobuttoninfoModule,
    StepperModule,
    ModalInfoBulleModule,
    CalculatedWithModule,
  ],
  providers: [RachatRenteviagereInfobullesResolve, BsModalRef],
})
export class RachatRenteViagereModule {
}
