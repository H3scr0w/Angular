import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Dn, OriginalDn } from '../../../../shared/models/tools/incapsula/incapsula-data.model';

@Component({
  selector: 'stgo-incapsula-dns',
  templateUrl: './incapsula-dns.component.html',
  styleUrls: ['./incapsula-dns.component.css']
})
export class IncapsulaDnsComponent implements OnInit {
  @Input()
  originalDn: OriginalDn[];
  @Input()
  dn: Dn[];
  @Input()
  isAdmin: boolean;

  ELEMENT_DATA_ORIGIN_DNS: OriginalDn[] = [];
  ELEMENT_DATA_DNS: Dn[] = [];
  datasourceOriginalDns = new MatTableDataSource(this.ELEMENT_DATA_ORIGIN_DNS);
  datasourceDns = new MatTableDataSource(this.ELEMENT_DATA_DNS);
  displayedColumns: string[] = ['name', 'type', 'data'];

  constructor() {}

  ngOnInit(): void {
    if (this.originalDn && this.originalDn.length > 0) {
      this.datasourceOriginalDns = new MatTableDataSource(this.originalDn);
    }

    if (this.dn && this.dn.length > 0) {
      this.datasourceDns = new MatTableDataSource(this.dn);
    }
  }
}
