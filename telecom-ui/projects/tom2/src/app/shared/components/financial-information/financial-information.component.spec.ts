import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CatalogDiscountService } from '../../../../../../tempo/src/app/shared/service/catalog-discount/catalog-discount.service';
import { MockCatalogDiscountService } from '../../../../../../tempo/src/app/shared/service/catalog-discount/catalog-discount.service.mock';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';
import { MockEventEmitterService } from '../../service/event-emitter/event-emitter.service.mock';
import { UtilService } from '../../service/util/util.service';
import { SharedModule } from '../../shared.module';
import { FinancialInformationComponent } from './financial-information.component';

describe('FinancialInformationComponent', () => {
  let component: FinancialInformationComponent;
  let fixture: ComponentFixture<FinancialInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CatalogDiscountService, useClass: MockCatalogDiscountService },
        { provide: UtilService, useClass: UtilService },
        { provide: EventEmitterService, useClass: MockEventEmitterService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
