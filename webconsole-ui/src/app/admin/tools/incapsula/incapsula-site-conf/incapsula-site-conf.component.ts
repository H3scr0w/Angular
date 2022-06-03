import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../shared/models/domain.model';
import { IncapsulaResponse } from '../../../../shared/models/tools/incapsula/incapsula-data.model';
import { SiteService } from '../../../../shared/services/tools/incapsula/site.service';
import { EditIncapsulaSiteConfDialogComponent } from './edit-incapsula-site-conf-dialog/edit-incapsula-site-conf-dialog.component';

@Component({
  selector: 'stgo-incapsula-site-conf',
  templateUrl: './incapsula-site-conf.component.html',
  styleUrls: ['./incapsula-site-conf.component.css']
})
export class IncapsulaSiteConfComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  siteConfs: IncapsulaResponse[];
  @Input()
  isAdmin: boolean;

  ELEMENT_DATA: IncapsulaResponse[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['ips', 'active', 'status', 'created', 'actions'];
  isLoading = false;

  private initSubscription: Subscription;

  constructor(public dialog: MatDialog, private siteService: SiteService) {}

  ngOnInit(): void {
    if (this.siteConfs) {
      this.datasource = new MatTableDataSource(this.siteConfs);
    }
  }

  ngOnDestroy(): void {
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
  }

  getSiteStatus(code: string): void {
    this.isLoading = true;
    this.initSubscription = this.siteService
      .getSiteStatus(code)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response: IncapsulaResponse) => {
        this.siteConfs = [response];
        this.datasource = new MatTableDataSource(this.siteConfs);
      });
  }

  openDialog(incapsulaSite: IncapsulaResponse): void {
    const domainCode = this.domain.code;

    const dialogRef = this.dialog.open(EditIncapsulaSiteConfDialogComponent, {
      width: '80%',
      data: { incapsulaSite, domainCode }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSiteStatus(domainCode);
      }
    });
  }
}
