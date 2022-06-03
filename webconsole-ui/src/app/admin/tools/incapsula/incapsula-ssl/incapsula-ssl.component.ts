import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../shared/models/domain.model';
import {
  CustomCertificate,
  GeneratedCertificate,
  IncapsulaResponse
} from '../../../../shared/models/tools/incapsula/incapsula-data.model';
import { ConfigurationService } from '../../../../shared/services/tools/incapsula/configuration.service';
import { SiteService } from '../../../../shared/services/tools/incapsula/site.service';
import { EditIncapsulaCustomCertDialogComponent } from './edit-incapsula-custom-cert-dialog/edit-incapsula-custom-cert-dialog.component';

@Component({
  selector: 'stgo-incapsula-ssl',
  templateUrl: './incapsula-ssl.component.html',
  styleUrls: ['./incapsula-ssl.component.css']
})
export class IncapsulaSslComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  generatedCertificate: GeneratedCertificate[];
  @Input()
  customCertificate: CustomCertificate[];
  @Input()
  isAdmin: boolean;

  ELEMENT_DATA_GENERATED_CERT: GeneratedCertificate[] = [];
  ELEMENT_DATA_CUSTOM_CERT: CustomCertificate[] = [];
  datasourceGeneratedCert = new MatTableDataSource(this.ELEMENT_DATA_GENERATED_CERT);
  datasourceCustomCert = new MatTableDataSource(this.ELEMENT_DATA_CUSTOM_CERT);
  generatedCertColumns: string[] = ['ca', 'method', 'data', 'status', 'san'];
  customCertColumns: string[] = [
    'active',
    'expiration',
    'revocationError',
    'validityError',
    'chainError',
    'hostnameMismatchError'
  ];

  deleting = false;
  isLoading = false;

  private initSubscription: Subscription;
  private confSubscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private configurationService: ConfigurationService,
    private siteService: SiteService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.generatedCertificate && this.generatedCertificate.length > 0) {
      this.datasourceGeneratedCert = new MatTableDataSource(this.generatedCertificate);
    }

    if (this.customCertificate && this.customCertificate.length > 0) {
      this.datasourceCustomCert = new MatTableDataSource(this.customCertificate);
    }
  }

  ngOnDestroy(): void {
    if (this.confSubscription) {
      this.confSubscription.unsubscribe();
    }
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
        if (response.ssl && response.ssl.generated_certificate) {
          this.generatedCertificate = [response.ssl.generated_certificate];
          this.datasourceGeneratedCert = new MatTableDataSource(this.generatedCertificate);
        }

        if (response.ssl && response.ssl.custom_certificate) {
          this.customCertificate = [response.ssl.custom_certificate];
          this.datasourceCustomCert = new MatTableDataSource(this.customCertificate);
        }
      });
  }

  openDialog(): void {
    const domainCode = this.domain.code;

    const dialogRef = this.dialog.open(EditIncapsulaCustomCertDialogComponent, {
      width: '80%',
      data: { domainCode }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSiteStatus(domainCode);
      }
    });
  }

  delete(): void {
    this.deleting = true;
    const domainCode = this.domain.code;
    this.confSubscription = this.configurationService
      .deleteCertificate(domainCode)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.datasourceCustomCert.data = [];
        this.cdRef.detectChanges();
      });
  }
}
