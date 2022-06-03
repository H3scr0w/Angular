import {Component, OnInit, TemplateRef} from '@angular/core';
import {PretService} from '../shared/pret.service';
import {ExportService} from '../../../shared/services/export.service';
import {Subscription} from 'rxjs';
import {PretRestit} from '../shared/pret-restit.model';
import {MetadataService} from '../../../shared/services/metadata.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Router} from '@angular/router';
import {BaseModuleDirective} from '../../base-module.directive';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {SwitchToRefinancementService} from '../../../shared/services/switch-to-refinancement.service';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {SelectedPretLine} from '../../../shared/services/selected-pret-line.model';
import {TypesTableauAmortissement} from '../../../shared/enums';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {UsufruitRestit} from '../../usufruit/shared/usufruit-restit.model';
import {CalculWithRestit} from '../../usufruit/shared/calcul-with-restit.model';

@Component({
  selector: 'ngx-app-pret-restit',
  templateUrl: './pret-restit.component.html',
  styleUrls: ['./pret-restit.component.scss'],
})
export class PretRestitComponent extends BaseModuleDirective implements OnInit {

  switchToRefinancementModal: BsModalRef;
  restit: PretRestit;
  subscription: Subscription;
  switchSubscription: Subscription;
  calculWithRestit: CalculWithRestit;

  echeancier: any[];

  columns = [
    {},
    {prop: 'restant', name: 'Capital restant dû', isEuro: true},
    {prop: 'amorti', name: 'Capital amorti', isEuro: true},
    {prop: 'interets', name: 'Intérêts', isEuro: true},
    {prop: 'assurance', name: 'Assurance', isEuro: true},
    {prop: 'versement', name: 'Montant du versement', isEuro: true},
  ];

  constructor(private pretService: PretService, private exportService: ExportService,
              private metaDataService: MetadataService, public modalService: BsModalService,
              private router: Router, private infoBullesService: InfoBullesService,
              private switchToRefinancementService: SwitchToRefinancementService,
              public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.pretService.subject$.subscribe(response => {
      this.calculWithRestit = response;
      this.restit = response.restit as PretRestit;
        this.echeancier = this.restit.tableau_amortissement;
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
    this.infoBulles = this.infoBullesService.getDataForPret();
  }

  ngOnInit() {
    this.showMobileForm = false;
  }

  async export(): Promise<void> {
    this.pretService.export(this.calculWithRestit).subscribe(response => {
      this.exportService.downloadFile(response, 'export-pret.pdf');
    });
  }

  openSwitchModal(template: TemplateRef<any>, selectedLine: any): void {
    this.switchToRefinancementModal = this.modalService.show(template, {ignoreBackdropClick: true});
    const selectedPretLine = new SelectedPretLine();
    selectedPretLine.capitalRestant = selectedLine['restant'];
    this.switchToRefinancementService.setPretSelectedLine(selectedPretLine);
  }

  redirectToRefinancement(): void {
    this.switchToRefinancementModal.hide();
    this.scrollTop();
    this.switchToRefinancementService.setPretRestitutionData(this.restit);
    this.router.navigateByUrl('/refinancement-pret');
  }
}
