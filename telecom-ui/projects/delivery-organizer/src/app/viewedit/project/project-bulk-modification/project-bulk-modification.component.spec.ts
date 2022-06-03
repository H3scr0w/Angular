import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared';
import { MessageService } from '../../../shared/message/message.service';
import { MockMessageService } from '../../../shared/message/message.service.mock';
import { DeploymentService } from '../../../shared/services/deploymet/deployment.service';
import { MockDeploymentService } from '../../../shared/services/deploymet/deployment.service.mock';
import { ProjectBulkModificationComponent } from './project-bulk-modification.component';

describe('ProjectBulkModificationComponent', () => {
  let component: ProjectBulkModificationComponent;
  let fixture: ComponentFixture<ProjectBulkModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: DeploymentService, useClass: MockDeploymentService },
        { provide: MessageService, useClass: MockMessageService }
      ],
      declarations: [ ProjectBulkModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBulkModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
