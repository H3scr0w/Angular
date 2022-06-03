import { Component, Input, OnInit } from '@angular/core';
import { Domain } from '../../../../shared/models/domain.model';
import { Acls } from '../../../../shared/models/tools/incapsula/incapsula-data.model';

@Component({
  selector: 'stgo-incapsula-acls',
  templateUrl: './incapsula-acls.component.html',
  styleUrls: ['./incapsula-acls.component.css']
})
export class IncapsulaAclsComponent implements OnInit {
  @Input()
  domain: Domain;
  @Input()
  aclsConf: Acls;
  @Input()
  isAdmin: boolean;

  constructor() {}

  ngOnInit(): void {}
}
