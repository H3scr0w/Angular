import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-header-print',
  templateUrl: './header-print.component.html',
  styleUrls: ['./header-print.component.scss'],
})
export class HeaderPrintComponent implements OnInit {

  @Input() headerTitle: string = '';

  officeName: string;
  date: string;

  constructor(public datepipe: DatePipe) {
    const currentUser = (JSON.parse(localStorage.getItem('currentUser')));
    this.officeName = currentUser ? currentUser.officeName : '';

    const today: Date = new Date();
    this.date = this.datepipe.transform(today, 'dd/MM/yyyy');
  }

  ngOnInit(): void {
  }

}
