import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PretCalculComponent} from './pret-calcul/pret-calcul.component';
import {PretRestitComponent} from './pret-restit/pret-restit.component';
import {PretRoutingModule} from './pret-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {NgxMaskModule} from 'ngx-mask';
import {PercentWithoutSignModule} from '../../shared/percent-without-sign/percent-without-sign.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EuroNumberModule} from '../../shared/euro-number/euro-number.module';
import {StepperModule} from '../../shared/components/stepper/stepper.module';
import {FormErrorDisplayModule} from '../../shared/form-error-display/form-error-display.module';
import {SwitchToRefinancementService} from '../../shared/services/switch-to-refinancement.service';
import {PretInfobullesResolve} from './pret-infobulles-resolve';
import {BsModalRef} from 'ngx-bootstrap';
import {ModalInfoBulleModule} from '../../shared/components/modal-info-bulle/modal-info-bulle.module';
// tslint:disable-next-line:max-line-length
import {TableauAmortissementComponent} from '../../shared/components/tableau-amortissement/tableau-amortissement.component';
import {DureePipeModule} from '../../shared/duree-pipe/duree-pipe.module';
import {InfobulleModule} from '../infobulle.module';
import {WarningMessageModalModule} from '../../shared/warning-message-modal/warning-message-modal.module';
import {CalculatedWithModule} from '../../shared/components/calculated-with/calculated-with.module';

@NgModule({
  declarations: [PretCalculComponent, PretRestitComponent, TableauAmortissementComponent],
  imports: [
    CommonModule,
    PretRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    PercentWithoutSignModule,
    EuroNumberModule,
    FormErrorDisplayModule,
    StepperModule,
    InfobulleModule,
    ModalInfoBulleModule,
    DureePipeModule,
    WarningMessageModalModule,
    CalculatedWithModule,
  ],
  providers: [PretInfobullesResolve, BsModalRef, SwitchToRefinancementService],
  exports: [
    TableauAmortissementComponent,
  ],
})
export class PretModule {
}
