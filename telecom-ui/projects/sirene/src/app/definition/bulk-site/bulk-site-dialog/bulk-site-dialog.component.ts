import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith, switchMap } from 'rxjs/operators';
import { Company, CompanyFilter, CompanyService, MessageService, Page, SiteService } from '../../../shared';
import { BulkSiteDTO } from '../../../shared/models/bulk-site-dto';
import { Contact } from '../../../shared/models/contact';

@Component({
  selector: 'stgo-bulk-site-dialog',
  templateUrl: './bulk-site-dialog.component.html',
  styleUrls: ['./bulk-site-dialog.component.scss']
})
export class BulkSiteDialogComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  isEnabled = false;
  isRsmLoading = false;
  companies: Company[];
  sifCodes: Observable<Company[]>;
  rsms: Contact[] = [];
  companyFilter: CompanyFilter = new CompanyFilter();
  inputSifCode: Subject<string> = new Subject<string>();
  inputCompany: Subject<string> = new Subject<string>();

  bulkSiteUpdateForm = this.fb.group({
    sifCode: [null],
    rsm: [null],
    company: [null]
  });

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private translateService: TranslateService,
    private companyService: CompanyService,
    private siteService: SiteService,
    public dialogRef: MatDialogRef<BulkSiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  private sub$: Subscription = new Subscription();

  ngOnInit() {
    this.sifCodes = this.inputSifCode.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((value: string) => {
        return this.companyService.getAllCompanies(value, 0, 50).pipe(
          switchMap(result => {
            return of(result.content.sort((a, b) => a.sifCode.localeCompare(b.sifCode)));
          })
        );
      })
    );

    this.getAllRSM();

    this.inputCompany.pipe(startWith(''), debounceTime(200), distinctUntilChanged()).subscribe(value => {
      this.companyFilter = new CompanyFilter();
      this.companyFilter.companyName = value;
      this.getAllCompanies(this.companyFilter);
    });

    this.sub$.add(
      this.bulkSiteUpdateForm
        .get('rsm')
        .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
        .subscribe(value => {
          this.checkValid();
        })
    );
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  onSubmit(): void {
    if (this.bulkSiteUpdateForm.get('sifCode').value || this.bulkSiteUpdateForm.get('rsm').value) {
      this.isLoading = true;
      const company = this.bulkSiteUpdateForm.get('sifCode').value;
      const rsm = this.bulkSiteUpdateForm.get('rsm').value;
      let siteCodes: string[] = [];
      if (this.data.site) {
        siteCodes = this.data.site;
      }

      const bulkSiteDTO: BulkSiteDTO = new BulkSiteDTO(company != null ? company.sifCode : null, rsm, siteCodes);

      if (this.data && this.data.mode === 'edit') {
        this.sub$.add(
          this.siteService
            .updateBulkSites(bulkSiteDTO)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              this.dialogRef.close();
              this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
            })
        );
      }
    }
  }

  onSifSelected(company: Company): void {
    if (company) {
      this.bulkSiteUpdateForm.get('company').setValue(company.companyName);
    } else {
      this.bulkSiteUpdateForm.get('company').setValue(null);
    }
    this.checkValid();
  }

  onCompanySelected(company: Company): void {
    if (company) {
      this.bulkSiteUpdateForm.get('sifCode').setValue(company);
    } else {
      this.bulkSiteUpdateForm.get('sifCode').setValue(null);
    }
    this.checkValid();
  }

  checkValid(): void {
    if (this.bulkSiteUpdateForm.get('sifCode').value || this.bulkSiteUpdateForm.get('rsm').value) {
      this.isEnabled = true;
    } else {
      this.isEnabled = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  hasError = (controlName: string, errorName: string) => {
    return this.bulkSiteUpdateForm.controls[controlName].hasError(errorName);
  };

  private getAllRSM(): void {
    this.isRsmLoading = true;
    this.sub$.add(
      this.siteService
        .getActiveRSMs()
        .pipe(finalize(() => (this.isRsmLoading = false)))
        .subscribe((page: Page<Contact>) => {
          if (page) {
            this.rsms = page.content.sort((a, b) => a.fullName.localeCompare(b.fullName));
          }
        })
    );
  }

  private getAllCompanies(companyFilter?: CompanyFilter): void {
    this.isLoading = true;
    this.companyFilter.skip = true;
    this.sub$.add(
      this.companyService
        .getAllCompanies('', 0, 50, 'name', 'asc', companyFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<Company>) => {
          if (page) {
            this.companies = page.content.sort((a, b) => a.companyName.localeCompare(b.companyName));
          }
        })
    );
  }
}
