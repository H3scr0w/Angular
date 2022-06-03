import { Component, Input, OnInit } from '@angular/core';
import { Domain } from '../../../../shared/models/domain.model';

@Component({
  selector: 'stgo-incapsula-monitoring',
  templateUrl: './incapsula-monitoring.component.html',
  styleUrls: ['./incapsula-monitoring.component.css']
})
export class IncapsulaMonitoringComponent implements OnInit {
  @Input()
  domain: Domain;
  @Input()
  isAdmin: boolean;

  constructor() {}

  ngOnInit(): void {}
}
