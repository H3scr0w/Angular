import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {RenteViagereRestit} from '../shared/rente-viagere-restit.model';
import {Subscription} from 'rxjs';
import {RenteViagereService} from '../shared/rente-viagere.service';
import {TabsetConfig} from 'ngx-bootstrap/tabs';
import {ExportService} from '../../../shared/services/export.service';
import {MetadataService} from '../../../shared/services/metadata.service';
import {BaseModuleDirective} from '../../base-module.directive';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Component({
  selector: 'ngx-app-rente-viagere-restit',
  templateUrl: './rente-viagere-restit.component.html',
  styleUrls: ['./rente-viagere-restit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TabsetConfig],
})
export class RenteViagereRestitComponent extends BaseModuleDirective implements OnInit, OnDestroy {

  restit: RenteViagereRestit;
  subscription: Subscription;
  switchSubscription: Subscription;
  calculWithRestit: CalculWithRestit;

  constructor(private renteViagereService: RenteViagereService, private exportService: ExportService,
              private metaDataService: MetadataService, private infoBullesService: InfoBullesService,
              public modalService: BsModalService, public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.renteViagereService.subject$.subscribe(response => {
      if (response == null) {
        this.restit = null;
        this.showMobileForm = false;
      } else {
        this.calculWithRestit = response;
        this.notifySwitchCalcRestitService.notifyCalculResultModel(this.calculWithRestit);
        this.restit = response.restit as RenteViagereRestit;
      }
    });
    this.switchSubscription = this.notifySwitchCalcRestitService.switchNotifiedSource$.subscribe(res => {
      this.showMobileForm = res;
    });
  }

  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForRenteViagere();
    this.showMobileForm = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPeriodicityIntlName(periodicity: number): string {
    switch (periodicity) {
      case 1:
        return 'rente-viagere.restitution.type-versements.annuelle';
      case 2:
        return 'rente-viagere.restitution.type-versements.semestrielle';
      case 4:
        return 'rente-viagere.restitution.type-versements.trimestrielle';
      case 12:
        return 'rente-viagere.restitution.type-versements.mensuelle';
    }
  }

  print(): void {
    this.notifySwitchCalcRestitService.notifyPrint(true);
  }

  async export(): Promise<void> {
    this.renteViagereService.export(this.calculWithRestit).subscribe(response => {
      const dateString = new Date().toLocaleDateString();
      this.exportService.downloadFile(response, 'HECTAUR-Export_PDF_RenteViagère_' + dateString + '.pdf');
    });
  }
}
