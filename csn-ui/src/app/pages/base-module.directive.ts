import {Directive, EventEmitter, Input, Output} from '@angular/core';
import {InfoBulleDataModel} from '../shared/models/info-bulle-data-model';
import {InfoBulleCodes, NumberFieldType} from '../shared/enums';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../shared/services/mobile-detector.service';
import {NotifySwitchCalcRestitService} from '../shared/services/notity-switch-calc-restit.service';

/**
 * Common modules behaviours
 */
@Directive()
export class BaseModuleDirective {

  @Input() formScroll: HTMLElement;

  numberFieldTypes = NumberFieldType;
  showMobileForm = true;
  infoBulles: InfoBulleDataModel[];
  infoBulleCodes = InfoBulleCodes;
  postToCalcul: boolean = false;
  mobHeight: any;
  mobWidth: any;
  bsModalRef: BsModalRef;
  restitFromSwitch: boolean = false;
  sessionTimedOut: boolean = false;
  @Output() hideEmitter = new EventEmitter();

  constructor(public modalService: BsModalService, public mobileDetectorService: MobileDetectorService,
              public notifySwitchCalcRestitService: NotifySwitchCalcRestitService) {
  }


  public scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  public scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  toggleMobileForm() {
    this.showMobileForm = !this.showMobileForm;
    this.notifySwitchCalcRestitService.notifySwitch(this.showMobileForm);
  }

  reset() {
    this.scrollTop();
    this.showMobileForm = true;
  }

  getInfoBulle(code: string): string {
    if (this.infoBulles != null && this.infoBulles.length > 0 && this.infoBulles.find(i => i.code === code)) {
      return this.infoBulles.find(i => i.code === code).html;
    } else {
      return null;
    }
  }

  getScreenSize() {
    // Fix for android, onresized is raised while swiping up in Chrome
    if (this.mobHeight !== window.screen.height) {
      this.mobHeight = (window.screen.height);
      this.mobWidth = (window.screen.width);
      if (this.bsModalRef) {
        this.bsModalRef.hide();
        this.bsModalRef = null;
      } else {
      }
    }
  }

}
