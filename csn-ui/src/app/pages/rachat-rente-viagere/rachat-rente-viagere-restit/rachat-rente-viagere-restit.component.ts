import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RachatRenteViagereRestit } from '../shared/rachat-rente-viagere-restit.model';
import { RachatRenteViagereService } from '../shared/rachat-rente-viagere.service';
import {ExportService} from '../../../shared/services/export.service';
import {MetadataService} from '../../../shared/services/metadata.service';
import {BaseModuleDirective} from '../../base-module.directive';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {BsModalService} from 'ngx-bootstrap';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';
import {UsufruitRestit} from '../../usufruit/shared/usufruit-restit.model';

@Component({
  selector: 'ngx-app-rachat-rente-viagere-restit',
  templateUrl: './rachat-rente-viagere-restit.component.html',
  styleUrls: ['./rachat-rente-viagere-restit.component.scss'],
})
export class RachatRenteViagereRestitComponent extends BaseModuleDirective implements OnInit, OnDestroy {
  restit: RachatRenteViagereRestit;
  subscription: Subscription;
  switchSubscription: Subscription;
  calculWithRestit: CalculWithRestit;

  constructor(private rachatRenteViagereService: RachatRenteViagereService, private exportService: ExportService,
              private metaDataService: MetadataService, public modalService: BsModalService,
              public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.rachatRenteViagereService.subject$.subscribe(response => {
      this.calculWithRestit = response;
      this.restit = response.restit as RachatRenteViagereRestit;
    });
    this.switchSubscription = this.notifySwitchCalcRestitService.switchNotifiedSource$.subscribe(res => {
      this.showMobileForm = res;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async export(): Promise<void> {
    this.rachatRenteViagereService.export(this.calculWithRestit).subscribe(response => {
      this.exportService.downloadFile(response, 'export-rachat-rente-viagere.pdf');
    });
  }
}
