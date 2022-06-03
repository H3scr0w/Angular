import { Component, Input, OnInit } from '@angular/core';
import { Domain } from '../../../../shared/models/domain.model';
import { PerformanceConfiguration } from '../../../../shared/models/tools/incapsula/incapsula-data.model';

@Component({
  selector: 'stgo-incapsula-cache',
  templateUrl: './incapsula-cache.component.html',
  styleUrls: ['./incapsula-cache.component.css']
})
export class IncapsulaCacheComponent implements OnInit {
  @Input()
  domain: Domain;
  @Input()
  cacheConf: PerformanceConfiguration;
  @Input()
  isAdmin: boolean;

  constructor() {}

  ngOnInit(): void {}
}
