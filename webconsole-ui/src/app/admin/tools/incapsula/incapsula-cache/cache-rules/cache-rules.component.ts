import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  CacheHeader,
  CacheRules,
  PerformanceConfiguration
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { CacheService } from '../../../../../shared/services/tools/incapsula/cache.service';

@Component({
  selector: 'stgo-cache-rules',
  templateUrl: './cache-rules.component.html',
  styleUrls: ['./cache-rules.component.css']
})
export class CacheRulesComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  cacheConf: PerformanceConfiguration;
  @Input()
  isAdmin: boolean;

  ELEMENT_DATA: CacheHeader[] = [];
  datasource = new MatTableDataSource(this.ELEMENT_DATA);
  displayedColumns: string[] = ['headers'];

  formGroup: FormGroup;

  saving = false;

  private cache$: Subscription;

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      header: new FormControl()
    });

    this.datasource.data = this.cacheConf.cache_headers;
    this.ELEMENT_DATA = this.ELEMENT_DATA.concat(this.datasource.data);
  }

  ngOnDestroy(): void {
    if (this.cache$) {
      this.cache$.unsubscribe();
    }
  }

  addHeader(): void {
    const headerValue: string = this.formGroup.get('header')!.value;
    const cacheHeader: CacheHeader = { headerName: headerValue.toUpperCase() };

    if (!this.ELEMENT_DATA.find((h) => h.headerName === cacheHeader.headerName)) {
      this.saving = true;

      const cacheRules: CacheRules = new CacheRules();
      cacheRules.cacheHeaders = this.datasource.data.map((h) => h.headerName);

      this.cache$ = this.cacheService
        .configureCacheRules(this.domain.code, cacheRules)
        .pipe(finalize(() => (this.saving = false)))
        .subscribe(() => {
          this.ELEMENT_DATA.push(cacheHeader);
          this.datasource = new MatTableDataSource(this.ELEMENT_DATA);
          this.cacheConf.cache_headers = this.datasource.data;
        });
    }
  }
}
