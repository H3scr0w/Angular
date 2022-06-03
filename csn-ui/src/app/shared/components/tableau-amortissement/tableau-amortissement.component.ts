import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ngx-tableau-amortissement',
  templateUrl: './tableau-amortissement.component.html',
  styleUrls: ['./tableau-amortissement.component.scss'],
})
export class TableauAmortissementComponent implements OnInit {
  @Input() columns: any[];
  @Input() title: string;
  private _echeancier: any[];
  btnHide: boolean = true;
  @Input() clickableRow: boolean = false;
  // Emitter returning the clicked row
  @Output() clickRowEmitter = new EventEmitter();

  ech10: any[];

  @Input()
  set echeancier(ech: any[]) {
    if (ech) {
      this._echeancier = ech;
      this.ech10 = this._echeancier.slice(0, 10);
    }
  }
  get echeancier() {
    return this._echeancier;
  }

  ngOnInit() {
  }

  toggleBtnHide(): void {
    this.btnHide = !this.btnHide;
  }

  clickRow(row: any) {
    this.clickRowEmitter.emit(row);
  }
}
