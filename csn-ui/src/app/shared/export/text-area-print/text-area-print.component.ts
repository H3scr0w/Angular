import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-textarea-print',
  templateUrl: './text-area-print.component.html',
  styleUrls: ['./text-area-print.component.scss'],
})
export class TextAreaPrintComponent implements OnInit {
  @Input() content: string;
  @Input() title: string;

  ngOnInit() {
  }
}
