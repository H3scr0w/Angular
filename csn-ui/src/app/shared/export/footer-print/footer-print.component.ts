import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-footer-print',
  templateUrl: './footer-print.component.html',
  styleUrls: ['./footer-print.component.scss'],
})
export class FooterPrintComponent implements OnInit {

  date: string;
  year: string;

  constructor(public datepipe: DatePipe) {
    const today: Date = new Date();
    this.date = this.datepipe.transform(today, 'dd/MM/yyyy');
    this.year = this.datepipe.transform(today, 'yyyy');
  }

  ngOnInit(): void {
  }

}
