import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'ngx-warning-message-modal',
  templateUrl: './warning-message-modal.component.html',
  styleUrls: ['./warning-message-modal.component.scss'],
})
export class WarningMessageModalComponent {
  @Input() public modalContent: TemplateRef<any>;
  @Input() html: string;
  @Output() hideEmitter = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) { }
  hide(): void {
    this.bsModalRef.hide();
    this.hideEmitter.emit();
  }
}
