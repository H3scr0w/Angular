import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Certificate } from '../../../shared/models/certificate.model';
import { Page } from '../../../shared/models/page.model';
import { CertificateService } from '../../../shared/services/certificate.service';
import { EditCertificateDialogComponent } from './edit-certificate-dialog/edit-certificate-dialog.component';

@Component({
  selector: 'stgo-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  certificates: Certificate[] = [];
  displayedColumns: string[] = ['code', 'name', 'passphrase', 'created', 'lastUpdate', 'updatedBy', 'actions'];
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  deleting = false;
  certificateCode: string;
  hide = true;
  searchValue: string;
  private sub$ = new Subscription();

  constructor(
    public dialog: MatDialog,
    private certificateService: CertificateService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCertificates('code', 'asc');
  }

  ngAfterViewInit(): void {
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sub$.add(this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getCertificates(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

    if (this.paginator) {
      this.sub$.add(this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getCertificates(this.sort.active, this.sort.direction, this.searchValue);
      }));
    }

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  openDialog(certificate?: Certificate): void {
    const dialogRef = this.dialog.open(EditCertificateDialogComponent, {
      width: '80%',
      data: { certificate }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getCertificates(this.sort.active, this.sort.direction, this.searchValue);
      }
    });
  }

  applyFilter(event: KeyboardEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const filterValue = target.value;
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = '';
    }
    this.getCertificates(this.sort.active, this.sort.direction, this.searchValue);
  }

  delete(certificate: Certificate): void {
    this.deleting = true;
    this.certificateCode = certificate.code;
    this.sub$.add(this.certificateService
      .deleteCertificate(certificate.code)
      .pipe(finalize(() => (this.deleting = false)))
      .subscribe(() => {
        this.getCertificates(this.sort.active, this.sort.direction, this.searchValue);
      }));
  }

  private getCertificates(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(this.certificateService
      .getAllCertificates(this.pageIndex, this.pageSize, sortField, sortDirection, search)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Certificate>) => {
        this.totalElements = page.totalElements;
        this.certificates = page.content;
        this.cdRef.detectChanges();
      }));
  }
}
