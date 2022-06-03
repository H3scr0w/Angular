import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UsufruitService} from '../shared/usufruit.service';
import {UsufruitRestit} from '../shared/usufruit-restit.model';
import {Label, SingleDataSet} from 'ng2-charts';
import {ChartOptions, ChartType} from 'chart.js';
import {ExportService} from '../../../shared/services/export.service';
import {MetadataService} from '../../../shared/services/metadata.service';
import {BaseModuleDirective} from '../../base-module.directive';
import {InfoBullesService} from '../../../shared/services/info-bulles.service';
import {BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../../../shared/services/notity-switch-calc-restit.service';
import {CalculWithRestit} from '../shared/calcul-with-restit.model';
import {TypesDemembrement} from '../../../shared/enums';

@Component({
  selector: 'ngx-app-usufruit-restit',
  templateUrl: './usufruit-restit.component.html',
  styleUrls: ['./usufruit-restit.component.scss'],
})
export class UsufruitRestitComponent extends BaseModuleDirective implements OnInit, OnDestroy {

  restit: UsufruitRestit;
  subscription: Subscription;
  switchSubscription: Subscription;
  calculWithRestit: CalculWithRestit;
  typesDemembrement = TypesDemembrement;

  single: SingleDataSet;

  colorScheme: any[] = [{ backgroundColor: ['#005B93', '#39E5B1'] }];
  options: ChartOptions = {
    aspectRatio: 1,
    legend: {
      display: true,
    },
  };

  public labels: Label[] = ['Nue-propriété', 'Usufruit'];
  public chartType: ChartType = 'doughnut';

  constructor(private _elementRef: ElementRef,
    private usufruitService: UsufruitService,
    private exportService: ExportService,
    private metaDataService: MetadataService,
    public modalService: BsModalService,
    private infoBullesService: InfoBullesService,
    public mobileDetectorService: MobileDetectorService,
    public notifySwitchCalcRestitService: NotifySwitchCalcRestitService,
  ) {
    super(modalService, mobileDetectorService, notifySwitchCalcRestitService);
    this.subscription = this.usufruitService.subject$.subscribe(response => {
      if (response == null) {
        this.restit = null;
        this.showMobileForm = false;
      } else {
        this.calculWithRestit = response;
        this.notifySwitchCalcRestitService.notifyCalculResultModel(this.calculWithRestit);
        this.restit = response.restit as UsufruitRestit;
        if (this.restit.nue_propriete_eco_pourcentage !== undefined
          && this.restit.usufruit_eco_pourcentage !== undefined) {
          const roundedNueProprietePourcent = Number(this.restit.nue_propriete_eco_pourcentage.toFixed(2));
          const roundedUsufruitPourcent = Number(this.restit.usufruit_eco_pourcentage.toFixed(2));
          this.single = [roundedNueProprietePourcent, roundedUsufruitPourcent];
        }
      }

    });
    this.switchSubscription = this.notifySwitchCalcRestitService.switchNotifiedSource$.subscribe(res => {
      this.showMobileForm = res;
    });
  }


  ngOnInit() {
    this.infoBulles = this.infoBullesService.getDataForUsufruit();
    this.showMobileForm = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  print(): void {
    this.notifySwitchCalcRestitService.notifyPrint(true);
  }

  async export(): Promise<void> {
    const canvas = document.getElementById('donut-canvas');
    // @ts-ignore
    (this.calculWithRestit.restit as UsufruitRestit).base64_donut = canvas.toDataURL();
    this.usufruitService.export(this.calculWithRestit).subscribe(response => {
      const dateString = new Date().toLocaleDateString();
      this.exportService.downloadFile(response, 'HECTAUR-Export_PDF_Usufruit_' + dateString + '.pdf');
    });
  }

}
