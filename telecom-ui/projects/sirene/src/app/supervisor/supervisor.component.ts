import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/internal/operators/startWith';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Contact } from '../shared/models/contact';
import { DropDownType } from '../shared/models/dropdown-type';
import { SupervisorRequestFilter } from '../shared/models/supervisor-request';
import { ContactService } from '../shared/services/contact/contact.service';
import { RequestSelectorService } from '../shared/services/request-selector/request-selector.service';

@Component({
  selector: 'stgo-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss'],
  providers: [DatePipe]
})
export class SupervisorComponent implements OnInit {
  filterCount = 0;
  companyAdvanceFilter: SupervisorRequestFilter;
  siteAdvanceFilter: SupervisorRequestFilter;
  panelFilterOpenState = true;
  displayedColumns: string[] = ['name', 'actions'];
  contacts: Observable<Contact[]>;
  actions: DropDownType[];
  status: DropDownType[];
  isSite = true;
  tabIndex = 0;

  supervisorAdvanceFilterForm = this.fb.group({
    status: [''],
    action: [''],
    applicant: [''],
    requestDate: ['']
  });

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private requestSelectorService: RequestSelectorService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.actions = this.requestSelectorService.getRequestActions();
    this.status = this.requestSelectorService.getRequeststatus();

    this.resetAdvanceFilter();

    this.contacts = this.supervisorAdvanceFilterForm.controls.applicant.valueChanges.pipe(
      startWith(''),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((query: string) => {
        return this.contactService.getAllContacts(0, 20, '', '', query).pipe(map(page => page.content));
      })
    );
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    if (this.supervisorAdvanceFilterForm.value.requestDate) {
      this.supervisorAdvanceFilterForm.value.requestDate = this.datePipe.transform(
        this.supervisorAdvanceFilterForm.value.requestDate,
        'yyyy-MM-dd'
      );
    }
    if (this.isSite) {
      this.siteAdvanceFilter = Object.assign({}, this.supervisorAdvanceFilterForm.value);
      this.countAdvanceFilter(this.siteAdvanceFilter);
    } else {
      this.companyAdvanceFilter = Object.assign({}, this.supervisorAdvanceFilterForm.value);
      this.countAdvanceFilter(this.companyAdvanceFilter);
    }
  }

  resetAdvanceFilter(): void {
    this.supervisorAdvanceFilterForm.reset();
    this.supervisorAdvanceFilterForm.controls.status.setValue('I');
    if (this.tabIndex === 0) {
      this.isSite = true;
      this.supervisorAdvanceFilterForm.controls.action.setValue('C');
    } else {
      this.isSite = false;
    }
    this.applyAdvanceFilter();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.supervisorAdvanceFilterForm.controls[controlName].hasError(errorName);
  }

  getName(contact?: Contact): string | undefined {
    if (this.supervisorAdvanceFilterForm && contact) {
      this.supervisorAdvanceFilterForm.controls.applicant.setValue(contact.id);
    }
    return contact ? contact.name + ' ' + contact.firstName : undefined;
  }

  private countAdvanceFilter(supervisorRequestFilter: SupervisorRequestFilter): void {
    this.filterCount = 0;
    if (supervisorRequestFilter) {
      if (supervisorRequestFilter.status) {
        this.filterCount++;
      }
      if (supervisorRequestFilter.action) {
        this.filterCount++;
      }
      if (supervisorRequestFilter.applicant) {
        this.filterCount++;
      }
      if (supervisorRequestFilter.requestDate) {
        this.filterCount++;
      }
    }
  }

  onTabClick(value: any): void {
    this.tabIndex = value.index;
    // Company
    if (this.supervisorAdvanceFilterForm && value.index === 1) {
      this.supervisorAdvanceFilterForm.controls.action.setValue('C');
      this.isSite = false;
    }
    // Site
    if (this.supervisorAdvanceFilterForm && value.index === 0) {
      this.isSite = true;
      this.supervisorAdvanceFilterForm.controls.action.setValue('C');
    }
    this.applyAdvanceFilter();
  }
}
