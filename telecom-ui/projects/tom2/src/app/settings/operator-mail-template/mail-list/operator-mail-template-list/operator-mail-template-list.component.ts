import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeMap,
  startWith,
  switchMap
} from 'rxjs/operators';
import { Networks } from '../../../../shared/models/networks.model';
import { OperatorMailTemplate } from '../../../../shared/models/operator-mail-template.model';
import { Page } from '../../../../shared/models/page.model';
import { MessageService } from '../../../../shared/service/message/message.service';
import { OperatorMailTemplateService } from '../../../../shared/service/operator-mail/operator-mail-template.service';
import { OperatorMailTemplateDialogComponent } from '../../mail-dialog/operator-mail-template-dialog/operator-mail-template-dialog.component';

@Component({
  selector: 'stgo-operator-template-mail-list',
  templateUrl: './operator-mail-template-list.component.html',
  styleUrls: ['./operator-mail-template-list.component.css']
})
export class OperatorMailTemplateListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  pageIndex = 0;
  pageSize = 10;
  isLoading = false;
  searchValue: string;
  updatedOperatorMailTemplates: OperatorMailTemplate[] = [];
  emailTemplates: OperatorMailTemplate[] = [];
  networkDetails: Networks[] = [];
  totalElements: number;
  displayedColumns: string[] = ['network', 'recipient', 'carbon copy', 'body', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  operatorMailTemplateForm = this.fb.group({
    emailTemplateArray: new FormArray([]) // this.fb.array([])
  });
  objetTypes: any;
  selectedObjet: any;
  selectedObjetArray: any[] = [];
  disabledUpdate = true;
  isTableFocus = false;
  enableTable = true;
  inputNetworks: Subject<string> = new Subject<string>();
  networksList: Observable<Networks[]>;
  networkIds: number[] = [];
  isAdmin: boolean;
  isOrderUser: boolean;

  private sub$: Subscription = new Subscription();

  constructor(
    private operatorMailService: OperatorMailTemplateService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.objetTypes = [
      { label: 'Order', value: 'O' },
      { label: 'Request', value: 'R' }
    ];
    this.selectedObjet = { label: 'Order', value: 'O' };
    this.searchValue = this.selectedObjet.value;

    this.isAdmin = this.authenticationService.credentials.isAdmin;
    this.isOrderUser = this.authenticationService.credentials.isOrderUser;

    this.networksList = this.inputNetworks.pipe(
      startWith(''),
      filter(value => value && value.length > 1),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value: string) => {
        this.isLoading = true;
        return this.operatorMailService.getAllNetworks(0, 50, 'name', 'asc', value).pipe(
          switchMap(result => {
            return of(result.content);
          }),
          finalize(() => (this.isLoading = false))
        );
      })
    );
  }

  ngAfterViewInit() {
    this.getOperatorMailTemplates('id', 'asc', this.searchValue);
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        if (this.selectedObjet && this.selectedObjet.value) {
          this.searchValue = this.selectedObjet.value;
        }
        this.getOperatorMailTemplates(this.sort.active, this.sort.direction, this.searchValue);
      });
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        if (this.selectedObjet && this.selectedObjet.value) {
          this.searchValue = this.selectedObjet.value;
        }
        this.getOperatorMailTemplates(this.sort.active, this.sort.direction, this.searchValue);
      });
      this.dataSource.paginator = this.paginator;
    }
    this.cdRef.detectChanges();
  }

  onSubmit(): void {
    this.updatedOperatorMailTemplates = this.operatorMailTemplateForm.get('emailTemplateArray').value;

    this.updatedOperatorMailTemplates.forEach(emailTemplate => {
      if (emailTemplate.networks && emailTemplate.networks.id) {
        emailTemplate.network = emailTemplate.networks.id;
      }
    });

    this.sub$.add(
      this.operatorMailService.updateMailTemplates(this.updatedOperatorMailTemplates).subscribe(res => {
        this.messageService.show(this.translateService.instant('common.save.success.message'), 'success');
        this.disabledUpdate = true;
      })
    );
  }

  editOperatorMailTemplate(template: FormGroup): void {
    const operatorMailTemplate: OperatorMailTemplate = template.value;
    this.dialog
      .open(OperatorMailTemplateDialogComponent, {
        width: '800px',
        disableClose: true,
        data: { operatorMailTemplate, mode: 'edit' }
      })
      .afterClosed()
      .subscribe(result => {
        if (result !== 'close') {
          this.getOperatorMailTemplates(this.sort.active, this.sort.direction, this.selectedObjet.value);
        }
      });
  }

  enableUpdate(element: FormGroup) {
    if (element && element.value) {
      const emailTemplate: OperatorMailTemplate = element.value;
      if (emailTemplate.networks) {
        this.disabledUpdate = false;
      }
    } else {
      this.disabledUpdate = false;
    }
    this.cdRef.detectChanges();
  }

  allowUpdate() {
    this.pageIndex = 0;
    this.getOperatorMailTemplates(this.sort.active, this.sort.direction, this.selectedObjet.value);
    this.disabledUpdate = true;
  }

  checkNetwork(element: FormGroup, dataIndex: any) {
    const network: Networks = element.get('networks').value;
    if (!network) {
      this.disabledUpdate = true;
      this.selectedObjetArray.push({ key: dataIndex, value: 'true' });
    } else {
      this.disabledUpdate = false;
      if (this.selectedObjetArray.length > 0) {
        this.selectedObjetArray.forEach(data => {
          if (data.key === dataIndex) {
            data.value = 'false';
          } else {
            if (data.value === 'true') {
              this.disabledUpdate = true;
            }
          }
        });
      }
    }
  }

  hasError = (controlName: string, errorName: string) => {
    return this.operatorMailTemplateForm.controls[controlName].hasError(errorName);
  };

  ngOnDestroy(): void {
    this.sub$.unsubscribe();
  }

  changeStatus(element) {
    this.isTableFocus = element;
  }

  private asFormGroup(operatorMailTemplate: OperatorMailTemplate): FormGroup {
    const fg = new FormGroup({
      id: new FormControl(operatorMailTemplate.id ? operatorMailTemplate.id : null),
      networks: new FormControl(operatorMailTemplate.networks ? operatorMailTemplate.networks : null),
      recipient: new FormControl(operatorMailTemplate.recipient ? operatorMailTemplate.recipient : null),
      carbonCopy: new FormControl(operatorMailTemplate.carbonCopy ? operatorMailTemplate.carbonCopy : null),
      mailBody: new FormControl(operatorMailTemplate.mailBody ? operatorMailTemplate.mailBody : null),
      objet: new FormControl(operatorMailTemplate.objet ? operatorMailTemplate.objet : null),
      country: new FormControl({
        value: operatorMailTemplate.country ? '[' + operatorMailTemplate.country + ']' : null,
        disabled: true
      }),
      date: new FormControl(operatorMailTemplate.date ? operatorMailTemplate.date : new Date())
    });
    return fg;
  }

  private emailTemplateByNetwork(operatorMailTemplates: OperatorMailTemplate[]): Observable<OperatorMailTemplate[]> {
    return this.operatorMailService.getAllNetworks(0, 50, 'name', 'asc', null, this.networkIds).pipe(
      map(result => {
        const networkMap = new Map<number, Networks>();
        result.content.forEach(network => networkMap.set(network.id, network));

        operatorMailTemplates.forEach(emailTemplate => {
          if (networkMap.has(emailTemplate.network)) {
            emailTemplate.networks = networkMap.get(emailTemplate.network);
          } else {
            emailTemplate.networks = new Networks(null, 'N/A', 'N/A');
          }
          this.emailTemplates.push(emailTemplate);
        });
        return this.emailTemplates;
      })
    );
  }

  get getFormControl() {
    return this.operatorMailTemplateForm.controls;
  }

  get getFormArray() {
    return this.getFormControl.emailTemplateArray as FormArray;
  }

  private getAllAsFormArray(page: Page<OperatorMailTemplate>): Observable<FormArray> {
    if (this.getFormArray.length > 0) {
      this.operatorMailTemplateForm.reset();
      this.getFormArray.clear();
      this.networkIds = [];
      this.emailTemplates = [];
    }
    const operatorMailTemplates: OperatorMailTemplate[] = page.content;
    operatorMailTemplates.forEach(mailTemplates => {
      if (!this.networkIds.includes(mailTemplates.network)) {
        this.networkIds.push(mailTemplates.network);
      }
    });

    return this.emailTemplateByNetwork(operatorMailTemplates).pipe(
      map(result => {
        const fgs = result.map(this.asFormGroup);
        this.totalElements = page.totalElements;
        this.cdRef.detectChanges();
        return new FormArray(fgs);
      })
    );
  }

  private getOperatorMailTemplates(sortField?: string, sortDirection?: SortDirection, search?: string): void {
    this.isLoading = true;
    this.sub$.add(
      this.operatorMailService
        .getAllMailTemplates(search, this.pageIndex, this.pageSize, sortField, sortDirection)
        .pipe(mergeMap((page: Page<OperatorMailTemplate>) => this.getAllAsFormArray(page)))
        .subscribe((formArray: FormArray) => {
          this.operatorMailTemplateForm.setControl('emailTemplateArray', formArray);
          this.dataSource = new MatTableDataSource(this.getFormArray.controls);
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
    );
  }
}
