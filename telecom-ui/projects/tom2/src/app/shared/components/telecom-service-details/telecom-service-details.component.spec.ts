import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { CatalogService } from '../../service/catalog/catalog.service';
import { MockCatalogService } from '../../service/catalog/catalog.service.mock';
import { CommandService } from '../../service/commands/command.service';
import { MockCommandService } from '../../service/commands/command.service.mock';
import { ContractService } from '../../service/contract/contract.service';
import { MockContractService } from '../../service/contract/contract.service.mock';
import { EventEmitterService } from '../../service/event-emitter/event-emitter.service';
import { MockEventEmitterService } from '../../service/event-emitter/event-emitter.service.mock';
import { OperatorsService } from '../../service/operators/operators.service';
import { MockOperatorsService } from '../../service/operators/operators.service.mock';
import { RequestService } from '../../service/request/request.service';
import { MockRequestService } from '../../service/request/request.service.mock';
import { SharedModule } from '../../shared.module';
import { TelecomServiceDetailsComponent } from './telecom-service-details.component';

class MatDialogRefStub {
  close() {}
}

describe('TelecomServiceDetailsComponent', () => {
  let component: TelecomServiceDetailsComponent;
  let fixture: ComponentFixture<TelecomServiceDetailsComponent>;
  const matDialogRefStub = new MatDialogRefStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: OperatorsService, useClass: MockOperatorsService },
        { provide: ContractService, useClass: MockContractService },
        { provide: CatalogService, useClass: MockCatalogService },
        { provide: EventEmitterService, useClass: MockEventEmitterService },
        { provide: CommandService, useClass: MockCommandService },
        { provide: RequestService, useClass: MockRequestService },
        { provide: MatDialogRef, useValue: matDialogRefStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecomServiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
