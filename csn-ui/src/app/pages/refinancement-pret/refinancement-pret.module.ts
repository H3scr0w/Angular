import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RefinancementPretCalculComponent} from './refinancement-pret-calcul/refinancement-pret-calcul.component';
import {RefinancementPretRestitComponent} from './refinancement-pret-restit/refinancement-pret-restit.component';
import {RefinancementPretRoutingModule} from './refinancement-pret-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';
import {EuroNumberModule} from '../../shared/euro-number/euro-number.module';
import {FormErrorDisplayModule} from '../../shared/form-error-display/form-error-display.module';
import {StepperModule} from '../../shared/components/stepper/stepper.module';
import {SwitchToRefinancementService} from '../../shared/services/switch-to-refinancement.service';
import {RefinancementPretInfobullesResolve} from './refinancement-pret-infobulles-resolve';
import {BsModalRef} from 'ngx-bootstrap';
import {ModalInfoBulleModule} from '../../shared/components/modal-info-bulle/modal-info-bulle.module';
import {PretModule} from '../pret/pret.module';
import {CalculatedWithModule} from '../../shared/components/calculated-with/calculated-with.module';
import {InfobulleModule} from '../infobulle.module';
import {DureePipeModule} from '../../shared/duree-pipe/duree-pipe.module';
import {AnnuitePipeModule} from '../../shared/annuite-pipe/annuite-pipe.module';

@NgModule({
  declarations: [RefinancementPretCalculComponent, RefinancementPretRestitComponent],
  imports: [
    CommonModule,
    RefinancementPretRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    NgxMaskModule,
    EuroNumberModule,
    FormErrorDisplayModule,
    StepperModule,
    ModalInfoBulleModule,
    PretModule,
    CalculatedWithModule,
    InfobulleModule,
    DureePipeModule,
    AnnuitePipeModule,
  ],
  providers: [SwitchToRefinancementService, RefinancementPretInfobullesResolve, BsModalRef],
})
export class RefinancementPretModule {
}
