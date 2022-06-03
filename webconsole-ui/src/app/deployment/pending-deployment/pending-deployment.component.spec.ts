import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { websiteReducer } from '../../core/webconsole/website.reducer';
import { PendingDeploymentComponent } from './pending-deployment.component';

describe('PendingDeploymentComponent', () => {
  let component: PendingDeploymentComponent;
  let fixture: ComponentFixture<PendingDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PendingDeploymentComponent],
      imports: [
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        StoreModule.forRoot({
          website: websiteReducer
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
