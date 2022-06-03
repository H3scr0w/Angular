import {Component, Input, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'ngx-modal-info-bulle',
  templateUrl: './modal-info-bulle.component.html',
  styleUrls: ['./modal-info-bulle.component.scss'],
})
export class ModalInfoBulleComponent implements OnInit {
  @Input() html: string;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  hide() {
    this.bsModalRef.hide();
  }

}
