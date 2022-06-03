import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  CacheMode,
  CacheModes,
  DurationPeriod
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { CacheService } from '../../../../../shared/services/tools/incapsula/cache.service';

@Component({
  selector: 'stgo-cache-mode',
  templateUrl: './cache-mode.component.html',
  styleUrls: ['./cache-mode.component.css']
})
export class CacheModeComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  isAdmin: boolean;

  isLoading = false;
  purging = false;
  savingMode = false;

  defaultMode = {
    value: CacheModes.static_only,
    tag: 'Static Only',
    desc: '(Standard) cache according to standard http headers'
  };

  modes = [
    {
      value: CacheModes.disable,
      tag: 'Disable Caching',
      desc: 'no content will be cached'
    },
    {
      value: CacheModes.static_only,
      tag: 'Static Only',
      desc: '(Standard) cache according to standard http headers'
    },
    {
      value: CacheModes.static_and_dynamic,
      tag: 'Static + Dynamic',
      desc: '(Advanced) also profile dynamic pages and cache for',
      period: DurationPeriod.min
    },
    {
      value: CacheModes.aggressive,
      tag: 'Aggressive',
      desc: 'cache each and every resource on the webserver for',
      period: DurationPeriod.hr
    }
  ];

  periods = [
    { value: DurationPeriod.sec, viewValue: 'Seconds' },
    { value: DurationPeriod.min, viewValue: 'Minutes' },
    { value: DurationPeriod.hr, viewValue: 'Hours' },
    { value: DurationPeriod.days, viewValue: 'Days' },
    { value: DurationPeriod.weeks, viewValue: 'Weeks' }
  ];

  activeMode = new FormControl(this.defaultMode);
  staticDynamicNummber = new FormControl(5);
  aggressiveNummber = new FormControl(1);

  private purgeSubscription: Subscription;
  private saveModeSubscription: Subscription;

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.purgeSubscription) {
      this.purgeSubscription.unsubscribe();
    }
    if (this.saveModeSubscription) {
      this.saveModeSubscription.unsubscribe();
    }
  }

  purge(): void {
    this.purging = true;

    this.purgeSubscription = this.cacheService
      .purgeCache(this.domain.code)
      .pipe(finalize(() => (this.purging = false)))
      .subscribe();
  }

  saveMode(): void {
    this.savingMode = true;

    const modeValue: string = this.activeMode.value.value;

    const cacheModes: CacheModes = CacheModes[modeValue];
    let dynamicCacheDuration: number = null!;
    let aggressiveCacheDuration: number = null!;
    let period: DurationPeriod = null!;

    if (cacheModes && cacheModes.toString() === CacheModes.static_and_dynamic.toString()) {
      dynamicCacheDuration = this.staticDynamicNummber.value;
      period = this.activeMode.value.period;
    } else if (cacheModes && cacheModes.toString() === CacheModes.aggressive.toString()) {
      aggressiveCacheDuration = this.aggressiveNummber.value;
      period = this.activeMode.value.period;
    }

    const mode: CacheMode = {
      cacheMode: cacheModes,
      dynamicCacheDuration,
      aggressiveCacheDuration,
      durationPeriod: period
    };

    this.saveModeSubscription = this.cacheService
      .configureCacheMode(this.domain.code, mode)
      .pipe(finalize(() => (this.savingMode = false)))
      .subscribe();
  }

  compareFn(c1: string, c2: string): boolean {
    return c1 === c2;
  }
}
