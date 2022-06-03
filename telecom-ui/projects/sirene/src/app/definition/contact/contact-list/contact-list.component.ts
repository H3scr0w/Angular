import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, Page } from '@shared';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Contact, ContactFilter } from '../../../shared/models/contact';
import { Profile } from '../../../shared/models/profile';
import { ContactService } from '../../../shared/services/contact/contact.service';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';

@Component({
  selector: 'stgo-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  contacts: Contact[] = [];
  profile: Profile[] = [];
  isLoading = false;
  totalElements: number;
  searchValue: string;
  pageIndex = 0;
  pageSize = 10;
  advanceFilter: ContactFilter;
  filterCount = 0;
  panelFilterOpenState = true;
  displayedColumns: string[] = ['name', 'firstName', 'email', 'fixPhone', 'mobilePhone', 'actions'];

  contactAdvanceFilterForm = this.fb.group({
    firstName: [''],
    name: [''],
    email: [''],
    showArchived: ['']
  });

  isAdmin: boolean;
  isRsm: boolean;
  isDoAdmin: boolean;
  isSpoAdmin: boolean;

  private filter = new Subject<string>();
  private filter$: Subscription;
  private initSubscription: Subscription;
  private contactSubscription: Subscription;
  private sub$: Subscription = new Subscription();

  constructor(
    private authenticationService: AuthenticationService,
    private contactService: ContactService,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private translateService: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isRsm = this.authenticationService.credentials.isRsm;
    this.isDoAdmin = this.authenticationService.credentials.isDoAdmin;
    this.isSpoAdmin = this.authenticationService.credentials.isSpoAdmin;

    this.filter$ = this.filter.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchValue: string) => {
      this.pageIndex = 0;
      this.searchValue = searchValue;
      this.resetAdvanceFilter();
    });

    this.sub$.add(this.filter$);
    this.sub$.add(this.initSubscription);
    this.sub$.add(this.contactSubscription);
  }

  ngAfterViewInit() {
    this.getAllContacts('name', 'asc');
    // If the user changes the sort order, reset back to the first page.
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
      });
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  addContact(): void {
    this.dialog
      .open(ContactDialogComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: { contact: new Contact(), mode: 'add' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  editContact(data: Contact): void {
    this.dialog
      .open(ContactDialogComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: { contact: data, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
        }
      });
  }

  deleteContact(data: Contact): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: this.translateService.instant('common.delete.confirmation.message')
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          this.contactSubscription = this.contactService
            .deleteContact(data.id)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.delete.success.message'), 'success');
                this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            });
        }
      });
  }

  recoverContact(data: Contact): void {
    this.dialog
      .open(ConfirmationDialogComponent, {
        width: '350px',
        disableClose: true,
        data: this.translateService.instant('common.recover.confirmation.message')
      })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.isLoading = true;
          this.contactSubscription = this.contactService
            .recoverContact(data)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(res => {
              if (res) {
                this.messageService.show(this.translateService.instant('common.recover.success.message'), 'success');
                this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
              }
            });
        }
      });
  }

  applyFilter(filterValue: string): void {
    if (filterValue && filterValue !== '') {
      this.searchValue = filterValue;
    } else {
      this.searchValue = null;
    }
    this.filter.next(this.searchValue);
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.searchValue = null;
    this.advanceFilter = Object.assign({}, this.contactAdvanceFilterForm.value);
    this.countAdvanceFilter();
    this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  resetAdvanceFilter(): void {
    this.contactAdvanceFilterForm.reset();
    this.advanceFilter = null;
    this.countAdvanceFilter();
    this.getAllContacts(this.sort.active, this.sort.direction, this.searchValue, this.advanceFilter);
  }

  private countAdvanceFilter(): void {
    this.filterCount = 0;
    if (this.advanceFilter) {
      if (this.advanceFilter.firstName) {
        this.filterCount++;
      }
      if (this.advanceFilter.name) {
        this.filterCount++;
      }
      if (this.advanceFilter.email) {
        this.filterCount++;
      }
      if (this.advanceFilter.showArchived) {
        this.filterCount++;
      }
    }
  }

  private getAllContacts(
    sortField?: string,
    sortDirection?: SortDirection,
    search?: string,
    contactFilter?: ContactFilter
  ): void {
    this.isLoading = true;
    this.initSubscription = this.contactService
      .getAllContacts(this.pageIndex, this.pageSize, sortField, sortDirection, search, contactFilter)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((page: Page<Contact>) => {
        if (page) {
          this.contacts = page.content;
          this.totalElements = page.totalElements;
          this.cdRef.detectChanges();
        }
      });
  }
}
