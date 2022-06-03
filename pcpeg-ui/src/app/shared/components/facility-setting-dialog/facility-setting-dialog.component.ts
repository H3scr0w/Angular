import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, startWith } from 'rxjs/operators';
import { FacilityModel } from '../../models/facility.model';
import { Page } from '../../models/page.model';
import { FacilityService } from '../../service/facility/facility.service';
import { FacilityFilter } from './../../models/facility.model';
import { IFacilitySettingDialogData } from './facility-setting-dialog-data';

@Component({
  selector: 'stgo-facility-setting-dialog',
  templateUrl: './facility-setting-dialog.component.html',
  styleUrls: ['./facility-setting-dialog.component.css']
})
export class FacilitySettingDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  perimeterForm: FormGroup = new FormGroup({
    perimeter: new FormControl(null, Validators.required),
    facility: new FormControl(null, Validators.required)
  });

  isLoading = false;
  facilities: FacilityModel[] = [];
  inputFacility: Subject<string> = new Subject<string>();

  companyPerimeter = 'company';
  facilityPerimeter = 'facility';

  private sub$: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<FacilitySettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFacilitySettingDialogData,
    private cdRef: ChangeDetectorRef,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.authority && this.data.authority.facility) {
      const currentFacility: FacilityModel = this.data.authority.facility;
      this.perimeterForm.controls.perimeter.patchValue(this.facilityPerimeter);
      this.perimeterForm.controls.facility.patchValue(currentFacility);
    } else {
      this.perimeterForm.controls.perimeter.patchValue(this.companyPerimeter);
      this.perimeterForm.controls.facility.clearValidators();
      this.perimeterForm.controls.facility.updateValueAndValidity();
    }

    this.sub$.add(
      this.inputFacility.pipe(startWith(''), debounceTime(500), distinctUntilChanged()).subscribe((value) => {
        this.getAllFacilities(value);
      })
    );

    this.onChanges();
  }

  onChanges(): void {
    this.sub$.add(
      this.perimeterForm.get('perimeter')!.valueChanges.subscribe((val) => {
        if (val === 'company') {
          this.perimeterForm.controls.facility.setErrors(null);
          this.perimeterForm.controls.facility.clearValidators();
        } else if (val === 'facility') {
          if (!this.perimeterForm.controls.facility.value) {
            this.perimeterForm.controls.facility.reset();
            this.perimeterForm.controls.facility.setErrors({ required: true });
          }
          this.perimeterForm.controls.facility.setValidators(Validators.required);
        }
        this.perimeterForm.updateValueAndValidity();
      })
    );
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }

  onNoClick(): void {
    this.dialogRef.close('close');
  }

  onSubmit(): void {
    if (this.perimeterForm.controls.perimeter.value === this.facilityPerimeter) {
      this.dialogRef.close(this.perimeterForm.controls.facility.value);
    } else {
      this.dialogRef.close(this.companyPerimeter);
    }
  }

  private getAllFacilities(value: string): void {
    if (this.data && this.data.societeSid) {
      this.isLoading = true;
      const advanceFilter = new FacilityFilter();
      advanceFilter.facilityLabel = value;
      advanceFilter.active = true;
      advanceFilter.societeSid = this.data.societeSid;
      this.sub$.add(
        this.facilityService
          .getAllFacilities(0, 50, 'facilityLabel', 'asc', advanceFilter)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((page: Page<FacilityModel>) => {
            if (page) {
              this.facilities = page.content.sort((a, b) =>
                a.facilityLabel!.trim().localeCompare(b.facilityLabel!.trim())
              );
              this.cdRef.detectChanges();
            }
          })
      );
    }
  }
}
