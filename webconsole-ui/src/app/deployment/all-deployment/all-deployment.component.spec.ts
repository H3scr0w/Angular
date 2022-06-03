import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@core';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared';
import { websiteReducer } from '../../core/webconsole/website.reducer';
import { AllDeploymentComponent } from './all-deployment.component';

describe('AllDeploymentComponent', () => {
  let component: AllDeploymentComponent;
  let fixture: ComponentFixture<AllDeploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllDeploymentComponent],
      imports: [
        SharedModule,
        CoreModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({
          website: websiteReducer
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
