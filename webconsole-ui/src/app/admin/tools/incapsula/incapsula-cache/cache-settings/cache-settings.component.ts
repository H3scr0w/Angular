import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Domain } from '../../../../../shared/models/domain.model';
import {
  CacheSettings,
  CacheSettingParams,
  PerformanceConfiguration
} from '../../../../../shared/models/tools/incapsula/incapsula-data.model';
import { CacheService } from '../../../../../shared/services/tools/incapsula/cache.service';

@Component({
  selector: 'stgo-cache-settings',
  templateUrl: './cache-settings.component.html',
  styleUrls: ['./cache-settings.component.css']
})
export class CacheSettingsComponent implements OnInit, OnDestroy {
  @Input()
  domain: Domain;
  @Input()
  cacheConf: PerformanceConfiguration;
  @Input()
  isAdmin: boolean;

  formGroup: FormGroup;
  saving = false;

  private cache$: Subscription;

  constructor(private cacheService: CacheService) {}

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      asyncVal: new FormControl({ value: this.cacheConf.async_validation, disabled: !this.isAdmin }),
      minifyJs: new FormControl({ value: this.cacheConf.minify_javascript, disabled: !this.isAdmin }),
      minifyCss: new FormControl({ value: this.cacheConf.minify_css, disabled: !this.isAdmin }),
      minifyStaticHtml: new FormControl({ value: this.cacheConf.minify_static_html, disabled: !this.isAdmin }),
      compressJpeg: new FormControl({ value: this.cacheConf.compress_jpeg, disabled: !this.isAdmin }),
      progressImgRender: new FormControl({
        value: this.cacheConf.progressive_image_rendering,
        disabled: !this.isAdmin
      }),
      agressiveCompression: new FormControl({ value: this.cacheConf.aggressive_compression, disabled: !this.isAdmin }),
      compressPng: new FormControl({ value: this.cacheConf.compress_png, disabled: !this.isAdmin }),
      flyCompression: new FormControl({ value: this.cacheConf.on_the_fly_compression, disabled: !this.isAdmin }),
      tcpPrePooling: new FormControl({ value: this.cacheConf.tcp_pre_pooling, disabled: !this.isAdmin }),
      complyNoCache: new FormControl({ value: this.cacheConf.comply_no_cache, disabled: !this.isAdmin }),
      complyVary: new FormControl({ value: this.cacheConf.comply_vary, disabled: !this.isAdmin }),
      userShortestCaching: new FormControl({ value: this.cacheConf.minify_javascript, disabled: !this.isAdmin }),
      preferLastModified: new FormControl({ value: this.cacheConf.prefer_last_modified, disabled: !this.isAdmin }),
      disableClienSideCaching: new FormControl({
        value: this.cacheConf.disable_client_side_caching,
        disabled: !this.isAdmin
      })
    });
  }

  ngOnDestroy(): void {
    if (this.cache$) {
      this.cache$.unsubscribe();
    }
  }

  onChange(control: string, param: string): void {
    const value: boolean = this.formGroup.controls[control].value;
    this.updateCacheSettings(param, value);
  }

  private updateCacheSettings(param: string, value: boolean): void {
    this.saving = true;

    const settingParam: CacheSettingParams = CacheSettingParams[param];

    const settings: CacheSettings = { param: settingParam, value };

    this.cache$ = this.cacheService
      .configureCacheSettings(this.domain.code, settings)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        Object.defineProperty(this.cacheConf, param, { value });
      });
  }
}
