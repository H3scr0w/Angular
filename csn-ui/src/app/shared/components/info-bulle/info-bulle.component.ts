import {Component, HostListener, Input, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MobileDetectorService} from '../../services/mobile-detector.service';
import {DeviceTypes} from '../../enums';
import {ModalInfoBulleComponent} from '../modal-info-bulle/modal-info-bulle.component';

@Component({
  selector: 'ngx-info-bulle',
  templateUrl: './info-bulle.component.html',
  styleUrls: ['./info-bulle.component.scss'],
})
export class InfoBulleComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() html: string;
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  mobHeight: any;
  mobWidth: any;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: true,
    class: 'modal-dialog-centered',
  };

  constructor(private modalService: BsModalService,
              public mobileDetectorService: MobileDetectorService) {}

  ngOnInit() {
    if (!this.placement) {
      this.placement = 'right';
    }
    this.getScreenSize();
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.mobHeight = (window.screen.height);
    this.mobWidth = (window.screen.width);
    if (this.modalRef) {
      this.modalRef.hide();
      this.modalRef = null;
    }
  }
  get isMobileOrTablet(): boolean {
    return (this.mobileDetectorService.deviceType === DeviceTypes.TABLET && this.mobHeight > this.mobWidth)
      || this.mobileDetectorService.deviceType === DeviceTypes.MOBILE;
  }

  openModal() {
    if (this.mobHeight > this.mobWidth) {
      const initialState = {
        html: this.html,
      };
      this.modalRef = this.modalService.show(ModalInfoBulleComponent, Object.assign({},
        this.config, {initialState}));
    }
  }
}
