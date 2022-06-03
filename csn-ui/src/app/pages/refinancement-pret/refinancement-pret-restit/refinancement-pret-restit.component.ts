import {Component, OnInit} from '@angular/core';
import {RefinancementPretRestit} from '../shared/refinancement-pret-restit.model';
import {Subscription} from 'rxjs';
import {RefinancementPretService} from '../shared/refinancement-pret.service';
import {ExportService} from '../../../shared/services/export.service';
import {BaseModuleDirective} from '../../base-module.directive';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {BsModalService} from 'ngx-bootstrap';
import {DureeType, TypesTableauAmortissement} from '../../../shared/enums';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';
import {UsufruitRestit} from '../../usufruit/shared/usufruit-restit.model';

@Component({
  selector: 'ngx-app-refinancement-pret-restit',
  templateUrl: './refinancement-pret-restit.component.html',
  styleUrls: ['./refinancement-pret-restit.component.scss'],
})
export class RefinancementPretRestitComponent extends BaseModuleDirective implements OnInit {

  restitFromSwitch: boolean = false;
  restit: RefinancementPretRestit;
  subscription: Subscription;
  switchSubscription: Subscription;
  calculWithRestit: CalculWithRestit;

  dureeTypes = DureeType;
  echeancier: any[];

  columns = [
    {},
    {prop: 'restant', name: 'Capital restant dû', isEuro: true},
    {prop: 'amorti', name: 'Capital amorti', isEuro: true},
    {prop: 'interets', name: 'Intérêts', isEuro: true},
    {prop: 'assurance', name: 'Assurance', isEuro: true},
    {prop: 'versement', name: 'Montant du versement', isEuro: true},
  ];

  constructor(private refinamcementPretService: RefinancementPretService, private exportService: ExportService,
              private infoBullesService: InfoBullesService,
              private switchToRefinancementService: SwitchToRefinancementService,
              public mobileDetectorService: MobileDetectorService,
              public modalService: BsModalService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.refinamcementPretService.subject$.subscribe(response => {
      this.calculWithRestit = response;
      this.restit = response.restit as RefinancementPretRestit;
        this.echeancier =  this.restit.tableau_amortissement;
        // If there is a date print it, else print the row number
        if (this.restit.type_tableau_amortissement === TypesTableauAmortissement.AVEC_DATE) {
          this.columns[0] = {prop: 'annee', name: 'Années', isEuro: false};
        } else {
          this.columns[0] = {prop: 'numero', name: 'N°', isEuro: false};
        }
    });
    this.switchSubscription = this.notifySwitchCalcRestitService.switchNotifiedSource$.subscribe(res => {
      this.showMobileForm = res;
    });
    this.infoBulles = this.infoBullesService.getDataForRefinancementPret();
  }

  ngOnInit() {
  }

  async export(): Promise<void> {
    this.refinamcementPretService.export(this.calculWithRestit).subscribe(response => {
      this.exportService.downloadFile(response, 'export-refinancement-pret.pdf');
    });
  }
}
