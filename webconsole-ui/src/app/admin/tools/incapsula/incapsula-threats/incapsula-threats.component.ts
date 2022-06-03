import { Component, Input, OnInit } from '@angular/core';
import { Domain } from '../../../../shared/models/domain.model';
import { Waf } from '../../../../shared/models/tools/incapsula/incapsula-data.model';

@Component({
  selector: 'stgo-incapsula-threats',
  templateUrl: './incapsula-threats.component.html',
  styleUrls: ['./incapsula-threats.component.css']
})
export class IncapsulaThreatsComponent implements OnInit {
  @Input()
  domain: Domain;
  @Input()
  wafConf: Waf;
  @Input()
  isAdmin: boolean;

  constructor() {}

  ngOnInit(): void {}
}
