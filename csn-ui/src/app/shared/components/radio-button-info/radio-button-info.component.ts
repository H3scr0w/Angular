import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ngx-radio-button-info',
  templateUrl: './radio-button-info.component.html',
  styleUrls: ['./radio-button-info.component.scss'],
})
export class RadioButtonInfoComponent implements OnInit {
  @Input() show: boolean;
  @Input() right: boolean;
  @Input() html: string;
  constructor() {
  }

  ngOnInit() {
  }

}
