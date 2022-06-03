import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { FacilityFilter, FacilityModel } from '../../../shared/models/facility.model';
import { Page } from '../../../shared/models/page.model';
import { FacilityService } from '../../../shared/service/facility/facility.service';
import { MessageService } from '../../../shared/service/message/message.service';

@Component({
  selector: 'stgo-facilities',
  templateUrl: './facility-list.component.html',
  styleUrls: ['./facility-list.component.scss']
})
export class FacilityListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort: MatSort;
  totalElements: number;
  pageIndex = 0;
  pageSize = 10;
  displayedColumns: string[] = ['codeSif', 'companyLabel', 'facilityId', 'facilityLabel', 'isActive', 'actions'];
  isLoading = false;
  facility: FacilityModel[] = [];
  codeSifs: FacilityModel[] = [];
  companyLabels: FacilityModel[] = [];
  inputCodeSif: Subject<string> = new Subject<string>();
  inputCompanyLabel: Subject<string> = new Subject<string>();
  editFacility: FacilityModel;
  oldFacility: FacilityModel;
  addFacility: FacilityModel;
  hideFirstRow = true;
  filterCount = 0;
  panelFilterOpenState = false;
  advanceFilterForm = this.fb.group({
    codeSif: [null]
  });
  advanceFilter: FacilityFilter;
  sortCodeSif = 'societe.codeSif';
  sortCompanyLabel = 'societe.societeLibelle';
  private sub$: Subscription = new Subscription();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private facilityService: FacilityService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private fb: FormBuilder
  ) {
    this.getAllFacilities('id.facilityId', 'asc');

    this.sub$.add(
      this.inputCodeSif.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        this.getDistinctCompanies(this.sortCodeSif, value);
      })
    );
    this.sub$.add(
      this.inputCompanyLabel.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        this.getDistinctCompanies(this.sortCompanyLabel, null!, value);
      })
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.pageIndex = 0;
        this.getAllFacilities(this.sort.active, this.sort.direction);
      });
    }

    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.getAllFacilities(this.sort.active, this.sort.direction);
      });
    }

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  toggleFilterPanel(): void {
    this.panelFilterOpenState = !this.panelFilterOpenState;
  }

  applyAdvanceFilter(): void {
    this.pageIndex = 0;
    this.advanceFilter = Object.assign(this.advanceFilterForm.value);
    this.countAdvanceFilter(this.advanceFilter);
    this.getAllFacilities(this.sort.active, this.sort.direction);
  }

  countAdvanceFilter(filter?: FacilityFilter): void {
    this.filterCount = 0;
    if (filter) {
      if (filter.codeSif) {
        this.filterCount++;
      }
    }
  }

  resetAdvanceFilter(): void {
    this.advanceFilterForm.reset();
    this.advanceFilter = null!;
    this.countAdvanceFilter();
    this.getAllFacilities(this.sort.active, this.sort.direction);
  }

  editRow(facility: FacilityModel): void {
    this.hideFirstRow = true;
    this.editFacility = null!;
    this.addFacility = null!;
    if (!facility) {
      return;
    }

    this.editFacility = facility.facilityId ? facility : null!;
    if (this.editFacility) {
      this.editFacility.isActive === 'Yes' ? (this.editFacility.isActive = 'O') : (this.editFacility.isActive = 'N');
    }
    this.oldFacility = { ...this.editFacility };
  }

  addRow(): void {
    this.cancelEdit();
    this.hideFirstRow = false;
    const facility: FacilityModel = this.facility[0];
    if (!facility) {
      return;
    }
    this.addFacility = facility.facilityId === '' ? facility : null!;
    this.oldFacility = { ...this.addFacility };
  }

  cancelEdit(): void {
    let facilityEdit: FacilityModel[] = [];
    this.hideFirstRow = true;
    this.editFacility = null!;
    this.addFacility = null!;
    if (this.oldFacility && (this.oldFacility.facilityId || this.oldFacility.facilityId === '')) {
      if (this.facility.length <= 0) {
        return;
      } else {
        this.facility[0].facilityId = '';
        facilityEdit = this.facility.map((facility) => facility);
        const index = facilityEdit.findIndex(
          (item) => item.facilityId === this.oldFacility.facilityId && item.codeSif === this.oldFacility.codeSif
        );
        this.oldFacility.isActive === 'O' ? (this.oldFacility.isActive = 'Yes') : (this.oldFacility.isActive = 'No');
        facilityEdit.splice(index, 1, this.oldFacility);
        this.facility = facilityEdit.map((facilitEdit) => facilitEdit);
      }
    }
  }

  exportDetails(): void {
    this.isLoading = true;
    this.sub$.add(
      this.facilityService
        .downloadFacilities(this.advanceFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((excelContent: Blob) => {
          if (excelContent) {
            const blob = new Blob([excelContent], { type: 'application/octet-stream' });
            saveAs(blob, 'Facilities.xlsx');
          }
        })
    );
  }

  saveFacility(): void {
    this.isLoading = true;
    if (this.editFacility) {
      // this.editFacility.isActive === 'Yes' ? (this.editFacility.isActive = 'O') : (this.editFacility.isActive = 'N');
      this.sub$.add(
        this.facilityService
          .createOrUpdateFacility(this.editFacility)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: FacilityModel) => {
            if (res) {
              this.editFacility = null!;
              this.messageService.show(this.translateService.instant('facility.save.success.message'), 'success');
              this.getAllFacilities(this.sort.active, this.sort.direction);
            }
          })
      );
    } else if (this.addFacility) {
      this.sub$.add(
        this.facilityService
          .createOrUpdateFacility(this.addFacility)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res: FacilityModel) => {
            if (res) {
              this.addFacility = null!;
              this.messageService.show(this.translateService.instant('facility.create.success.message'), 'success');
              this.facility.push(res);
              this.totalElements = this.totalElements + 1;
              this.hideFirstRow = true;
              this.getAllFacilities(this.sort.active, this.sort.direction);
            }
          })
      );
    }
  }

  private getDistinctCompanies(sortParam?: string, codeSif?: string, label?: string): void {
    this.isLoading = true;
    const filter = new FacilityFilter();
    filter.codeSif = codeSif;
    filter.companyLabel = label;
    this.sub$.add(
      this.facilityService
        .getDistinctCompanies(0, 2000, sortParam, 'asc', filter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((response: FacilityModel[]) => {
          if (response) {
            if (sortParam === this.sortCodeSif) {
              this.codeSifs = response;
            } else if (sortParam === this.sortCompanyLabel) {
              this.companyLabels = response;
            }
            this.cdRef.detectChanges();
          }
        })
    );
  }
  private getAllFacilities(sortField?: string, sortDirection?: SortDirection): void {
    this.isLoading = true;
    this.sub$.add(
      this.facilityService
        .getAllFacilities(this.pageIndex, this.pageSize, sortField, sortDirection, this.advanceFilter)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((page: Page<FacilityModel>) => {
          if (page) {
            this.facility = page.content;
            this.facility.unshift({
              codeSif: '',
              facilityId: '',
              facilityLabel: '',
              isActive: ''
            });
            this.totalElements = page.totalElements;
            this.cdRef.detectChanges();
          }
        })
    );
  }
}
